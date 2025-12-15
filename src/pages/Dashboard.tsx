import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  name: string;
  description: string;
  language: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: 'javascript'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadProjects(1);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadProjects = async (userId: number) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/888d0941-ac77-4476-be5b-3d14c55b9602?user_id=${userId}`
      );
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить проекты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название сайта и описание",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        'https://functions.poehali.dev/888d0941-ac77-4476-be5b-3d14c55b9602',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 1,
            ...newProject
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Сайт сгенерирован! 🎉",
          description: `${newProject.name} готов к редактированию`,
        });
        setProjects([data.project, ...projects]);
        setDialogOpen(false);
        setNewProject({ name: '', description: '', language: 'javascript' });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать сайт",
        variant: "destructive",
      });
    }
  };

  const openProject = (projectId: number) => {
    navigate(`/editor?project=${projectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getLanguageIcon = (lang: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      html: '🌐',
      css: '🎨',
      json: '📄'
    };
    return icons[lang] || '📝';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[status] || colors.draft;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0A0E27]">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="FolderKanban" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold font-montserrat gradient-text">WebSynapse</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Icon name="Home" size={16} className="mr-2" />
              Главная
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <Icon name="LogOut" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-montserrat mb-2">
              Добро пожаловать, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              У вас {projects.length} {projects.length === 1 ? 'сайт' : 'сайтов'}
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="glow">
                <Icon name="Wand2" size={20} className="mr-2" />
                Создать сайт
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-primary/30">
              <DialogHeader>
                <DialogTitle className="gradient-text">Создать новый сайт</DialogTitle>
                <DialogDescription>
                  Опишите какой сайт вы хотите создать, ИИ сделает всё остальное
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Название сайта</Label>
                  <Input
                    id="name"
                    placeholder="Лендинг для кофейни"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Опишите что должен делать сайт</Label>
                  <Textarea
                    id="description"
                    placeholder="Сайт с меню, фотографиями кофе, формой бронирования столика и контактами..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-background/50"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Стиль дизайна</Label>
                  <Select
                    value={newProject.language}
                    onValueChange={(value) => setNewProject({ ...newProject, language: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">🌟 Современный</SelectItem>
                      <SelectItem value="typescript">🎭 Минимализм</SelectItem>
                      <SelectItem value="python">🎨 Креативный</SelectItem>
                      <SelectItem value="html">🏪 Корпоративный</SelectItem>
                      <SelectItem value="css">✨ Элегантный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={createProject} className="w-full glow">
                  <Icon name="Wand2" size={18} className="mr-2" />
                  Генерировать сайт
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-primary/30 bg-card/50 backdrop-blur border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Icon name="FolderOpen" size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Пока нет сайтов</h3>
              <p className="text-muted-foreground mb-6">Опишите идею, ИИ сгенерирует готовый сайт за 60 секунд</p>
              <Button onClick={() => setDialogOpen(true)} className="glow">
                <Icon name="Wand2" size={20} className="mr-2" />
                Создать сайт
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:scale-105 cursor-pointer group"
                onClick={() => openProject(project.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getLanguageIcon(project.language)}</span>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Icon name="MoreVertical" size={18} />
                    </Button>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'Без описания'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {new Date(project.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {new Date(project.updated_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;