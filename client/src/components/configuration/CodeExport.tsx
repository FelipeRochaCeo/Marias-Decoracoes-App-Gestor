
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/store/authStore";

/**
 * Componente para exportação de todo o código-fonte em um único arquivo
 * para facilitar a análise e avaliação da arquitetura do projeto
 */
export function CodeExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Inicia o download do código-fonte consolidado
   */
  const handleExportCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // Criar um link para download do arquivo
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/export-source-code`;
      
      // Adicionar autenticação do usuário se necessário
      if (user?.id) {
        downloadLink.href += `?userId=${user.id}`;
      }
      
      downloadLink.download = "marias-decoracoes-source-code.md";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Erro ao exportar código:", err);
      setError("Não foi possível exportar o código. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exportar Código-Fonte</CardTitle>
        <CardDescription>
          Baixe todo o código-fonte em um único arquivo para análise e avaliação da arquitetura do projeto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Este arquivo consolidará todo o código-fonte do projeto em um único documento Markdown
          com comentários explicativos sobre a estrutura e funcionamento da aplicação.
        </p>
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Conteúdo incluído:</span>
            <ul className="list-disc list-inside ml-4 text-sm text-muted-foreground">
              <li>Código-fonte do frontend (React)</li>
              <li>Código-fonte do backend (Express)</li>
              <li>Definições de tipos e esquemas compartilhados</li>
              <li>Análise da arquitetura geral</li>
              <li>Comentários explicativos sobre cada arquivo</li>
            </ul>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleExportCode}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando arquivo...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Baixar Código-Fonte
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
