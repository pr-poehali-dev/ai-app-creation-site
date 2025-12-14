import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface VersionHistoryProps {
  projectId: string;
  onRestore: (code: string) => void;
}

interface Version {
  id: number;
  code: string;
  change_message: string;
  created_at: string;
}

export default function VersionHistory({ projectId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, [projectId]);

  const loadHistory = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://functions.poehali.dev/bfd0ac98-4e04-4b43-9b93-0fcc836f6d5e?project_id=${projectId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setVersions(data.history || []);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить историю версий",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (version: Version) => {
    onRestore(version.code);
    toast({
      title: "Версия восстановлена",
      description: `Код восстановлен из версии от ${new Date(version.created_at).toLocaleString()}`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCodePreview = (code: string) => {
    const lines = code.split('\n').slice(0, 3);
    return lines.join('\n').substring(0, 100) + (code.length > 100 ? '...' : '');
  };

  return (
    <Card className="border-primary/30 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="History" size={20} />
              История версий
            </CardTitle>
            <CardDescription>
              {versions.length > 0 ? `${versions.length} сохраненных версий` : 'Нет сохраненных версий'}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
          >
            {loading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="RefreshCw" size={16} />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Icon name="Loader2" size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon name="Archive" size={48} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Нет сохраненных версий</p>
              <p className="text-sm text-muted-foreground mt-1">
                Версии создаются автоматически при изменении кода
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedVersion === version.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {index === 0 && (
                          <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary">
                            <Icon name="Clock" size={12} className="mr-1" />
                            Последняя
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(version.created_at)}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-2">{version.change_message}</p>
                      <pre className="text-xs text-muted-foreground bg-background/50 p-2 rounded overflow-hidden">
                        {getCodePreview(version.code)}
                      </pre>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Undo2" size={16} className="mr-2" />
                      Восстановить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
