import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CodeEditor = () => {
  const [code, setCode] = useState(`function greet(name) {\n  return \`Hello, \${name}! 🚀\`;\n}\n\nconsole.log(greet('Developer'));`);
  const [language, setLanguage] = useState('javascript');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите описание кода",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    setTimeout(() => {
      const generatedCode = `// Код сгенерирован ИИ по запросу: "${aiPrompt}"\n\nfunction generatedFunction() {\n  // Здесь будет ваш код\n  console.log('Функция создана ИИ');\n  return 'Success';\n}\n\ngeneratedFunction();`;
      setCode(generatedCode);
      setAiLoading(false);
      toast({
        title: "Код сгенерирован!",
        description: "ИИ создал код по вашему запросу",
      });
      setAiPrompt('');
    }, 2000);
  };

  const handleRunCode = () => {
    setOutput('');
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => String(arg)).join(' '));
        };
        
        eval(code);
        
        console.log = originalLog;
        setOutput(logs.join('\n') || 'Код выполнен успешно ✓');
        toast({
          title: "Выполнено",
          description: "Код успешно запущен",
        });
      } catch (error: any) {
        setOutput(`Ошибка: ${error.message}`);
        toast({
          title: "Ошибка выполнения",
          description: error.message,
          variant: "destructive",
        });
      }
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '📄' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0A0E27]">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Code2" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold font-montserrat gradient-text">AI Editor</span>
            </div>
            <Badge variant="outline" className="hidden md:flex">
              <Icon name="Sparkles" size={14} className="mr-1" />
              Pro
            </Badge>
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

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/30 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileCode" size={20} />
                    Редактор кода
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.icon} {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleRunCode}>
                      <Icon name="Play" size={16} className="mr-2" />
                      Запустить
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-border">
                  <Editor
                    height="500px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Terminal" size={20} />
                  Вывод
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm min-h-[150px]">
                  {output ? (
                    <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="text-muted-foreground">Нажмите "Запустить" для выполнения кода</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={20} />
                  ИИ Ассистент
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Опишите что нужно создать: 'функция для сортировки массива', 'компонент кнопки React' и т.д."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={5}
                    className="bg-background/50"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAIGenerate}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Генерирую...
                    </>
                  ) : (
                    <>
                      <Icon name="Wand2" size={18} className="mr-2" />
                      Сгенерировать код
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <Icon name="Zap" size={14} className="text-primary" />
                    Безлимитные запросы на Pro
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="Brain" size={14} className="text-secondary" />
                    Powered by GPT-4 Turbo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon name="Lightbulb" size={18} />
                  Быстрые действия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Icon name="FileDown" size={16} className="mr-2" />
                  Экспорт кода
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Icon name="Share2" size={16} className="mr-2" />
                  Поделиться проектом
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Icon name="GitBranch" size={16} className="mr-2" />
                  Отправить в GitHub
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Icon name="Rocket" size={16} className="mr-2" />
                  Задеплоить
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon name="BookOpen" size={18} />
                  Примеры кода
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Tabs defaultValue="react">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="react">React</TabsTrigger>
                    <TabsTrigger value="node">Node.js</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="react" className="mt-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto py-2"
                      onClick={() => setCode(`import React from 'react';\n\nfunction Button({ text }) {\n  return (\n    <button className="btn">\n      {text}\n    </button>\n  );\n}\n\nexport default Button;`)}
                    >
                      <Icon name="Code" size={14} className="mr-2" />
                      Компонент Button
                    </Button>
                  </TabsContent>
                  <TabsContent value="node" className="mt-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto py-2"
                      onClick={() => setCode(`const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(3000);`)}
                    >
                      <Icon name="Server" size={14} className="mr-2" />
                      Express сервер
                    </Button>
                  </TabsContent>
                  <TabsContent value="python" className="mt-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto py-2"
                      onClick={() => setCode(`def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))`)}
                    >
                      <Icon name="Activity" size={14} className="mr-2" />
                      Fibonacci
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
