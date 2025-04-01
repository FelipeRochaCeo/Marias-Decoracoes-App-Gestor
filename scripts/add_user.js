
// Script para adicionar um usuário administrador
import pg from 'pg';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

// Função para criar usuário admin
async function createAdminUser() {
  try {
    // Criar pool de conexão
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    // Verificar se tabela users existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.error("Tabela 'users' não existe. Execute as migrações primeiro.");
      await pool.end();
      return;
    }

    // Verificar se usuário já existe
    const userCheck = await pool.query(`
      SELECT * FROM users WHERE username = 'admin';
    `);

    if (userCheck.rows.length > 0) {
      console.log("Usuário 'admin' já existe.");
    } else {
      // Gerar hash de senha (padrão: 'admin123')
      const passwordHash = await bcrypt.hash('admin123', 10);

      // Inserir usuário admin
      await pool.query(`
        INSERT INTO users (username, password_hash, name, email, role, status)
        VALUES ('admin', $1, 'Administrador', 'admin@example.com', 'Admin', 'ativo');
      `, [passwordHash]);
      console.log("Usuário 'admin' criado com sucesso!");
    }

    // Verificar se papel Admin existe
    const roleCheck = await pool.query(`
      SELECT * FROM roles WHERE name = 'Admin';
    `);

    if (roleCheck.rows.length === 0) {
      // Criar papel Admin com todas as permissões
      await pool.query(`
        INSERT INTO roles (name, permissions)
        VALUES ('Admin', ARRAY['*']);
      `);
      console.log("Papel 'Admin' criado com sucesso!");
    }

    await pool.end();
    console.log("Processo concluído! Use credenciais: admin / admin123");
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
  }
}

createAdminUser();
