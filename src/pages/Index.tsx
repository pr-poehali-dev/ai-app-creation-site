import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Базовый',
      price: '990₽',
      period: '/месяц',
      description: 'Для начинающих разработчиков',
      features: [
        'До 3 проектов',
        '10 запросов к ИИ в день',
        'Базовые шаблоны',
        'Поддержка Email',
        'Экспорт кода'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Про',
      price: '2990₽',
      period: '/месяц',
      description: 'Для профессионалов',
      features: [
        'Безлимитные проекты',
        'Безлимитные запросы к ИИ',
        'Все шаблоны + премиум',
        'Приоритетная поддержка 24/7',
        'GitHub интеграция',
        'API доступ',
        'Командная работа'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Энтерпрайз',
      price: 'От 9990₽',
      period: '/месяц',
      description: 'Для больших команд',
      features: [
        'Всё из Про',
        'Выделенный сервер',
        'Кастомные модели ИИ',
        'SLA 99.9%',
        'Персональный менеджер',
        'Корпоративная безопасность',
        'Обучение команды'
      ],
      popular: false
    }
  ];

  const features = [
    {
      icon: 'Sparkles',
      title: 'ИИ-Генерация кода',
      description: 'Создавайте приложения на React, Vue, Angular через естественный язык'
    },
    {
      icon: 'Code2',
      title: 'Умный редактор',
      description: 'Интеллектуальные подсказки, автодополнение и исправление ошибок'
    },
    {
      icon: 'Zap',
      title: 'Мгновенный деплой',
      description: 'Публикуйте ваши проекты в облако одним кликом'
    },
    {
      icon: 'Database',
      title: 'База данных',
      description: 'Автоматическая настройка и управление PostgreSQL, MongoDB'
    },
    {
      icon: 'GitBranch',
      title: 'Git интеграция',
      description: 'Синхронизация с GitHub, GitLab, версионирование'
    },
    {
      icon: 'Users',
      title: 'Командная работа',
      description: 'Совместная разработка в режиме реального времени'
    }
  ];

  const handlePayment = (planId: string) => {
    setSelectedPlan(planId);
    alert(`Переход к оплате тарифа через FreeKassa.\nВыбран план: ${plans.find(p => p.id === planId)?.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0A0E27]">
      
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Rocket" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold font-montserrat gradient-text">AI Dev Platform</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Возможности</a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Тарифы</a>
            <a href="#projects" className="text-foreground/80 hover:text-foreground transition-colors">Проекты</a>
            <Button variant="outline" size="sm">Войти</Button>
            <Button size="sm" className="glow">Начать</Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icon name="Menu" size={24} />
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
          🚀 Версия 2.0 — Теперь с GPT-4 Turbo
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold font-montserrat mb-6 gradient-text animate-slide-up">
          Создавайте приложения
          <br />
          силой мысли
        </h1>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Превратите идеи в готовые приложения за минуты. Искусственный интеллект напишет код, настроит базу данных и задеплоит проект автоматически.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8 hover-glow">
            <Icon name="Play" size={20} className="mr-2" />
            Попробовать бесплатно
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            <Icon name="Video" size={20} className="mr-2" />
            Смотреть демо
          </Button>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl animate-glow-pulse"></div>
          <Card className="relative border-primary/30 bg-card/50 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="bg-[#1e1e1e] rounded-lg p-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">AI Editor</span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">1</span>
                    <span className="text-purple-400">const</span>
                    <span className="text-foreground ml-2">createApp</span>
                    <span className="text-foreground ml-2">=</span>
                    <span className="text-foreground ml-2">(</span>
                    <span className="text-orange-400">prompt</span>
                    <span className="text-foreground">)</span>
                    <span className="text-foreground ml-2">=&gt;</span>
                    <span className="text-foreground ml-2">{'{'}</span>
                  </div>
                  <div className="flex ml-4">
                    <span className="text-muted-foreground mr-4">2</span>
                    <span className="text-blue-400">AI</span>
                    <span className="text-foreground">.</span>
                    <span className="text-yellow-300">generate</span>
                    <span className="text-foreground">(</span>
                    <span className="text-orange-400">prompt</span>
                    <span className="text-foreground">);</span>
                  </div>
                  <div className="flex ml-4">
                    <span className="text-muted-foreground mr-4">3</span>
                    <span className="text-purple-400">return</span>
                    <span className="text-green-400 ml-2">&quot;Готовое приложение 🚀&quot;</span>
                    <span className="text-foreground">;</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">4</span>
                    <span className="text-foreground">{'}'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">Возможности</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            Всё для разработки
          </h2>
          <p className="text-xl text-foreground/70">
            Полный набор инструментов для создания современных приложений
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:scale-105 group"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                  <Icon name={feature.icon as any} size={24} className="text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Тарифы</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            Выберите свой план
          </h2>
          <p className="text-xl text-foreground/70">
            Прозрачные цены для любых задач. Оплата через FreeKassa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative border-2 transition-all hover:scale-105 ${
                plan.popular 
                  ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/20' 
                  : 'border-primary/20 bg-card/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-1">
                    🔥 Популярный
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-montserrat mb-2">{plan.name}</CardTitle>
                <CardDescription className="mb-4">{plan.description}</CardDescription>
                <div className="mb-2">
                  <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Icon name="Check" size={20} className="text-primary flex-shrink-0" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handlePayment(plan.id)}
                >
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  {plan.popular ? 'Выбрать план' : 'Начать'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="projects" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">Проекты</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            Начните с шаблона
          </h2>
          <p className="text-xl text-foreground/70">
            Или создайте свой проект с нуля
          </p>
        </div>

        <Tabs defaultValue="templates" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="templates" className="text-base">
              <Icon name="LayoutTemplate" size={18} className="mr-2" />
              Шаблоны
            </TabsTrigger>
            <TabsTrigger value="myprojects" className="text-base">
              <Icon name="FolderKanban" size={18} className="mr-2" />
              Мои проекты
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            {[
              { name: 'E-commerce магазин', tech: 'React + Stripe', icon: 'ShoppingCart' },
              { name: 'CRM система', tech: 'Next.js + PostgreSQL', icon: 'Users' },
              { name: 'Блог платформа', tech: 'Vue + MongoDB', icon: 'BookOpen' },
              { name: 'Dashboard аналитики', tech: 'React + Charts', icon: 'BarChart3' }
            ].map((template, index) => (
              <Card key={index} className="border-primary/20 bg-card/50 hover:border-primary/50 transition-all group cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary group-hover:to-secondary transition-all">
                      <Icon name={template.icon as any} size={24} className="text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.tech}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="ArrowRight" size={20} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="myprojects">
            <Card className="border-primary/20 bg-card/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Icon name="FolderPlus" size={64} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Создайте первый проект</h3>
                <p className="text-muted-foreground mb-6">Опишите что хотите создать, ИИ сделает всё остальное</p>
                <Button className="glow">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Новый проект
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur">
          <CardContent className="py-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4 gradient-text">
              Готовы начать?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам разработчиков, которые уже создают приложения быстрее в 10 раз
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 hover-glow">
                <Icon name="Sparkles" size={20} className="mr-2" />
                Начать бесплатно
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Связаться с нами
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Rocket" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold font-montserrat">AI Dev</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Разработка приложений через искусственный интеллект
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Возможности</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Тарифы</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Документация</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Карьера</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AI Dev Platform. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
