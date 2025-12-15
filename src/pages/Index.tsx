import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { createFreeKassaPaymentUrl, generateOrderId } from '@/utils/freekassa';

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Стартовый',
      price: '490₽',
      period: '/месяц',
      description: 'Для личных проектов',
      features: [
        'До 3 сайтов',
        '50 ИИ-генераций в месяц',
        'Готовые шаблоны дизайна',
        'Бесплатный домен .site',
        'Базовая поддержка'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Бизнес',
      price: '1990₽',
      period: '/месяц',
      description: 'Для коммерческих проектов',
      features: [
        'Безлимит сайтов',
        'Неограниченные ИИ-генерации',
        'Премиум шаблоны и компоненты',
        'Свой домен + SSL сертификат',
        'SEO оптимизация',
        'Поддержка 24/7',
        'Аналитика посещений'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Агентство',
      price: 'От 4990₽',
      period: '/месяц',
      description: 'Для веб-студий',
      features: [
        'Всё из Бизнес',
        'Белая метка (White Label)',
        'API для интеграций',
        'Приоритетная генерация',
        'Мультиязычность сайтов',
        'Персональный менеджер',
        'Обучение команды'
      ],
      popular: false
    }
  ];

  const features = [
    {
      icon: 'Wand2',
      title: 'Создание за 60 секунд',
      description: 'Опишите идею сайта — ИИ сгенерирует полноценный дизайн и функционал'
    },
    {
      icon: 'Palette',
      title: 'Умный дизайнер',
      description: 'ИИ подберёт цвета, шрифты, анимации под ваш стиль и целевую аудиторию'
    },
    {
      icon: 'Smartphone',
      title: 'Адаптивная вёрстка',
      description: 'Все сайты автоматически адаптируются под мобильные, планшеты и десктоп'
    },
    {
      icon: 'Zap',
      title: 'Публикация в 1 клик',
      description: 'Сайт мгновенно выходит в интернет с SSL сертификатом и быстрым хостингом'
    },
    {
      icon: 'Search',
      title: 'SEO оптимизация',
      description: 'ИИ автоматически настраивает метатеги, структуру и скорость для поисковиков'
    },
    {
      icon: 'MessageSquare',
      title: 'Правки голосом',
      description: 'Скажите что изменить — ИИ тут же обновит дизайн, текст или функционал'
    }
  ];

  const handlePayment = (planId: string) => {
    setSelectedPlan(planId);
    const selectedPlan = plans.find(p => p.id === planId);
    
    if (!selectedPlan) return;

    const amountMap: Record<string, number> = {
      'basic': 990,
      'pro': 2990,
      'enterprise': 9990
    };

    const orderId = generateOrderId();
    const paymentUrl = createFreeKassaPaymentUrl({
      merchantId: 'YOUR_MERCHANT_ID',
      amount: amountMap[planId],
      orderId: orderId,
      secretKey: 'YOUR_SECRET_KEY',
      description: `Тариф ${selectedPlan.name} - AI Dev Platform`,
      email: ''
    });

    window.open(paymentUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0A0E27]">
      
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Rocket" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold font-montserrat gradient-text">WebSynapse</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Возможности</a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Тарифы</a>
            <a href="#projects" className="text-foreground/80 hover:text-foreground transition-colors">Проекты</a>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>Войти</Button>
            <Button size="sm" className="glow" onClick={() => window.location.href = '/register'}>Начать</Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icon name="Menu" size={24} />
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
          ✨ Новинка — ИИ-генерация сайтов за 60 секунд
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold font-montserrat mb-6 gradient-text animate-slide-up">
          Создайте сайт мечты
          <br />
          за одну минуту
        </h1>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Просто опишите, какой сайт вам нужен. ИИ создаст дизайн, напишет код, добавит анимации и опубликует в интернет — всё автоматически.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8 hover-glow" onClick={() => window.location.href = '/register'}>
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
                    <span className="text-foreground ml-2">prompt</span>
                    <span className="text-foreground ml-2">=</span>
                    <span className="text-green-400 ml-2">&quot;Лендинг для кофейни с меню и формой брони&quot;</span>
                    <span className="text-foreground">;</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">2</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">3</span>
                    <span className="text-blue-400">AI</span>
                    <span className="text-foreground">.</span>
                    <span className="text-yellow-300">generateWebsite</span>
                    <span className="text-foreground">(</span>
                    <span className="text-orange-400">prompt</span>
                    <span className="text-foreground">);</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">4</span>
                    <span className="text-muted-foreground ml-2">// ✨ Создан дизайн, вёрстка, анимации...</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">5</span>
                    <span className="text-muted-foreground ml-2">// 🚀 Опубликован на custom-coffee.site</span>
                  </div>
                  <div className="flex mt-4">
                    <span className="text-muted-foreground mr-4">6</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground mr-4">7</span>
                    <span className="text-green-400">// ⚡ Сайт готов за 60 секунд, без единой строчки кода!</span>
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
            Создавайте любые сайты
          </h2>
          <p className="text-xl text-foreground/70">
            От лендингов до интернет-магазинов — всё через диалог с ИИ
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
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">Готовые решения</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            Шаблоны сайтов
          </h2>
          <p className="text-xl text-foreground/70">
            Начните с шаблона или создайте уникальный дизайн
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
              { name: 'Лендинг для бизнеса', tech: 'Современный дизайн', icon: 'Sparkles' },
              { name: 'Интернет-магазин', tech: 'С каталогом и корзиной', icon: 'ShoppingCart' },
              { name: 'Портфолио', tech: 'Галерея работ + контакты', icon: 'Briefcase' },
              { name: 'Корпоративный сайт', tech: 'Многостраничный + SEO', icon: 'Building2' }
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
                <h3 className="text-xl font-semibold mb-2">Создайте первый сайт</h3>
                <p className="text-muted-foreground mb-6">Опишите идею, ИИ сгенерирует дизайн за 60 секунд</p>
                <Button className="glow">
                  <Icon name="Wand2" size={20} className="mr-2" />
                  Сгенерировать сайт
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
              Присоединяйтесь к тысячам пользователей, которые уже создают сайты без программирования
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 hover-glow" onClick={() => window.location.href = '/register'}>
                <Icon name="Wand2" size={20} className="mr-2" />
                Создать сайт бесплатно
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
                <span className="text-xl font-bold font-montserrat">WebSynapse</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Создание сайтов через искусственный интеллект
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