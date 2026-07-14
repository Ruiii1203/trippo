(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  var chartEl = document.getElementById('chart-version-scope');
  if (chartEl && typeof echarts !== 'undefined') {
    var chart = echarts.init(chartEl, null, { renderer: 'svg' });
    chart.setOption({
      animation: false,
      tooltip: { trigger: 'axis', appendToBody: true, axisPointer: { type: 'shadow' } },
      legend: { top: 0, textStyle: { color: muted } },
      grid: { left: 10, right: 20, bottom: 20, top: 54, containLabel: true },
      xAxis: {
        type: 'value',
        min: 0,
        max: 14,
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: 'category',
        data: ['V1.0 核心闭环', 'V2.0 体验丰富', 'V3.0 智能决策', 'V4.0 独旅模式', 'V5.0 协作增强'],
        axisLabel: { color: ink },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false }
      },
      color: [accent, accent2],
      series: [
        {
          name: '功能数量',
          type: 'bar',
          data: [13, 6, 5, 5, 6],
          itemStyle: { borderRadius: [0, 8, 8, 0], color: accent }
        },
        {
          name: '依赖复杂度',
          type: 'bar',
          data: [5, 6, 7, 6, 12],
          itemStyle: { borderRadius: [0, 8, 8, 0], color: accent2 }
        }
      ],
      backgroundColor: bg2
    });
    window.addEventListener('resize', function() { chart.resize(); });
  }

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(function(screen) {
      screen.classList.toggle('active', screen.getAttribute('data-screen') === name);
    });
    document.querySelectorAll('.demo-nav button').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === name);
    });
  }

  document.querySelectorAll('[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      showScreen(btn.getAttribute('data-tab'));
    });
  });

  document.querySelectorAll('[data-jump]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      showScreen(btn.getAttribute('data-jump'));
    });
  });

  var checkinBtn = document.getElementById('checkinBtn');
  if (checkinBtn) {
    checkinBtn.addEventListener('click', function() {
      showScreen('checkin');
    });
  }

  var moodIndex = 0;
  var moods = [
    {
      title: '低能量治愈',
      desc: '推荐：京都 · 书店 · 热汤 · 鸭川散步',
      reason: '因为你选择了“想放空 + 一个人”，优先推荐交通方便、活动密度低、适合独处的目的地。'
    },
    {
      title: '热血城市探索',
      desc: '推荐：曼谷 · 夜市 · 街头美食 · 城市漫步',
      reason: '因为你选择了“想热闹 + 想吃好吃的”，优先推荐夜间活跃、路线密集、美食丰富的城市。'
    },
    {
      title: '浪漫纪念日',
      desc: '推荐：大理 · 洱海日落 · 鲜花餐厅 · 海边民宿',
      reason: '因为你选择了“情侣 + 仪式感”，优先推荐节奏慢、拍照友好、有纪念感的目的地。'
    }
  ];

  var moodBtn = document.getElementById('moodBtn');
  if (moodBtn) {
    moodBtn.addEventListener('click', function() {
      moodIndex = (moodIndex + 1) % moods.length;
      document.getElementById('moodTitle').textContent = moods[moodIndex].title;
      document.getElementById('moodDesc').textContent = moods[moodIndex].desc;
      document.getElementById('reasonText').textContent = moods[moodIndex].reason;
    });
  }
})();
