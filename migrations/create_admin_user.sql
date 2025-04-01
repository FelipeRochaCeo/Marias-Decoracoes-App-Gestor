
-- Script para criar um usuário administrador
INSERT INTO users (username, password_hash, name, email, role, status)
VALUES 
('admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Administrador', 'admin@example.com', 'Admin', 'ativo')
ON CONFLICT (username) DO NOTHING;

-- Criar papel de Admin se não existir
INSERT INTO roles (name, permissions)
VALUES 
('Admin', ARRAY['*'])
ON CONFLICT (name) DO NOTHING;
