// 等待 DOM 加载完成后初始化 APlayer
document.addEventListener('DOMContentLoaded', function() {
  var ap = new APlayer({
    element: document.getElementById('player'),
    lrcType: 3,
    narrow: false,
    autoplay: false,
    showlrc: true,
    fixed: true,
    music: [{
            title: 'Yellow',
            author: '电鸟个灯泡',
            url: 'assets/musics/电鸟个灯泡 - Yellow.mp3',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/电鸟个灯泡 - Yellow.lrc'
        },{
            title: 'リビングデッド',
            author: 'amazarashi',
            url: 'assets/musics/amazarashi - リビングデッド.mp3',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/amazarashi - リビングデッド.lrc'
        },{
            title: '长生诀',
            author: '西瓜JUN',
            url: 'assets/musics/西瓜JUN - 长生诀.mp3',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/西瓜JUN - 长生诀.lrc'
        },{
            title: '不谓侠',
            author: '萧忆情Alex',
            url: 'assets/musics/萧忆情 - 不谓侠.mp3',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/萧忆情 - 不谓侠.lrc'
        },{
            title: 'シルバーワープ',
            author: 'いすぼくろ',
            url: 'assets/musics/いすぼくろ - シルバーワープ.mp3',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/いすぼくろ - シルバーワープ.lrc'
        },{
            title: '花鳥風月',
            author: 'SEKAI NO OWARI',
            url: 'assets/musics/花鳥風月.m4a',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/花鳥風月.lrc'
        },{
            title: 'Habit',
            author: 'SEKAI NO OWARI',
            url: 'assets/musics/Habit.m4a',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/Habit.lrc'
        },{
            title: 'La gloire à mes genoux',
            author: 'Côme',
            url: 'assets/musics/Côme - La gloire à mes genoux.mp3',
            pic: 'http://p2.music.126.net/9wO_aJTNb7r-VxGWqk17tw==/109951164427476845.jpg?param=130y130',
            lrc: 'assets/musics/lrc/Côme - La gloire à mes genoux.lrc'
        }
     ]
  });
});