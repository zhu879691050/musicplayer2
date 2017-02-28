
const log = function() {
    return console.log.apply(console, arguments);
}
const get = function(name){
    return document.querySelector(name)
}

const getAll = function(name){
    return document.querySelectorAll(name)
}
const bind = function(element, eventName,callback){
    element.addEventListener(eventName, callback)
}



var a = get('#id-audio-player')

  // 播放暂停键切换
  // Y控制是否切换播放键
const playButtonChange = function(Y) {
    let disc = get('.disc')
    let b = get('.play')
    let p = b.childNodes[0]
    let pauseButton = 'pause.png'
    let playButton = 'play.png'
    let p2 = document.createElement('img')
    let src = p.src.split('/')
    if (Y == 'N') {
      p2.src = './img/' + pauseButton
      disc.classList.remove('discMove')
      setTimeout(function(){
        disc.classList.add('discMove')
      }, 500)
    }else {
        if(src[src.length - 1] == pauseButton) {
          p2.src = './img/' + playButton
          disc.classList.remove('discMove')
        }else if(src[src.length - 1] == playButton){
          p2.src = './img/' + pauseButton
          disc.classList.add('discMove')
        }
    }
    p.remove()
    b.appendChild(p2)
}

  // 实现播放器播放暂停功能
  // 加入了进度条控制
  const play = function(Y){
    a.src = './music/' + menu[0]
    let b = get('.play')
    let p = b.childNodes[0]
    let pauseButton = 'pause.png'
    let playButton = 'play.png'
    let p2 = document.createElement('img')
    let src = p.src.split('/')
    if (src[src.length - 1] == playButton) {
      a.play()
      timeSchedule()
      // 切换播放键
      playButtonChange()
    } else if(src[src.length - 1] == pauseButton && Y !== "N"){
      a.pause()
      clearInterval(set)
      playButtonChange()
    }
    showSong()
  }


  // 实现播放列表
var menu = ['Black Sheep.mp3', 'Let You Win.mp3', 'Written In The Water.mp3', '阴天-李宗盛.mp3', '周杰伦 - 稻香.mp3', '寂寞难耐 (Live)-李宗盛.mp3']
const bindMenu = function(){
    let musicList = get('.musicList')
    for (var i = 0; i < menu.length; i++) {
        var li = document.createElement('li')
        li.innerHTML = menu[i]
        musicList.appendChild(li)
    }
}

  // 实现显示正在播放的歌名
const showSong = function(){
    var playing = get('.playing')
    var src = a.src.split('/')
    var src = src[src.length - 1]
    playing.innerHTML = decodeURI(src)
}

  // 实现点击歌名切换歌曲
const playSong = function(){
    let musicList = get('.musicList')
    bind(musicList, 'click', function(event){
        var e = event.target
        for (var i = 0; i < menu.length; i++) {
          if(menu[i] == e.innerHTML){
              clearInterval(set)
              a.src = './music/' + menu[i]
              playButtonChange('N')
              timeSchedule()
              a.play()
              showSong()
          }
        }
    })
}


  // 实现切换上一曲和下一曲
const changeSong = function(change){
    var list = null
    var src = a.src.split('/')
    var src = src[src.length - 1]
    for (var i = 0; i < menu.length; i++) {
      if (decodeURI(src) == menu[i]) {
        list = i
        if (change == 'next') {
          a.src = './music/' + menu[list + 1]
          if (list == menu.length - 1) {
              a.src = './music/' + menu[0]
          }

        }
        if (change == 'last') {
          a.src = './music/' + menu[list - 1]
          if (list == 0) {
              a.src = './music/' + menu[menu.length - 1]
          }
        }
        playButtonChange('N')
        a.play()
        showSong()
      }
    }
}

  // 进度条函数
const schedule =function(){
    var allTime = get('.allTime')
    var span = getAll('span')
    var thisTime = get('.thisTime').childNodes[0]
    var all = parseInt(Math.floor(a.duration))
    var nowTime = parseInt(Math.floor(a.currentTime))
    var clientAllTime = allTime.getBoundingClientRect()
    var nowSchedule = nowTime / all
    thisTime.width = nowSchedule * clientAllTime.width
    var second = function(Time){
      var sec = Time % 60
      if (sec < 10) {
        sec = '0' + sec
      }
      var time = Math.floor(Time / 60) + ":" + sec
      if (time == NaN) {
          time = "0:00"
      }
      return time
    }
    span[0].innerHTML = second(nowTime)
    span[1].innerHTML = second(all)
    if(all == nowTime){
      setTimeout(changeSong('next'), 3000)
    }
}

  // 实现点击进度条切换歌曲进度
const songSchedul = function(event){
    var allTime = get('.allTime')
    var thisTime = get('.thisTime').childNodes
    var clientAllTime = allTime.getBoundingClientRect()
    bind(allTime, 'click', function(event){
        var clientAllTime = allTime.getBoundingClientRect()
        var left = clientAllTime.left
        var width = clientAllTime.width
        var playTo = event.clientX
        var all = parseInt(Math.floor(a.duration))
        var nowTime = parseInt(Math.floor(a.currentTime))
        var clientAllTime = allTime.getBoundingClientRect()
        var nowSchedule = nowTime / all
        thisTime.width = nowSchedule * clientAllTime.width
        a.currentTime = (playTo - left) / width * all
        play("N")
    })
}

// 设定进度条
var set
const timeSchedule = function(){
    set = setInterval(schedule, 50)
}

// 发光效果函数
const light = function(event){
    var e = event.target
    e.classList.add('light')
}

// 移除发光效果函数
const dark = function(event){
    event.target.classList.remove('light')
}

  // 绑定切换歌曲函数到按钮
const bindChangeSong = function(){
    var conturl = get('.conturl')
    var next = get('.next')
    var last = get('.last')
    var b = get('.play')
    var allTime = get('.thisTime')

    // 绑定点击按钮播放
    bind(b, 'click', play)

    // 绑定点击切换上一曲下一曲
    bind(conturl, 'click', function(event){
        var e = event.target
        if (e == next) {
          changeSong('next')
          clearInterval(set)
          timeSchedule()
        }
        if(e == last) {
          changeSong('last')
          clearInterval(set)
          timeSchedule()
        }
    })
}

  // 绑定鼠标移入移除发光效果
const bindLight = function(){
    var next = get('.next')
    var last = get('.last')
    var b = get('.play')
    var allTime = get('.thisTime')
    var sound = get('.sound')
    bind(next, 'mouseover', light)
    bind(next, 'mouseout', dark)
    bind(last, 'mouseover', light)
    bind(last, 'mouseout', dark)
    bind(b, 'mouseover', function(){
      b.classList.add('light')
    })
    bind(b, 'mouseout', function(){
      b.classList.remove('light')
    })
    bind(allTime, 'mouseover', function(){
      allTime.classList.add('light')
    })
    bind(allTime, 'mouseout', function(){
      allTime.classList.remove('light')
    })
    bind(sound, 'mouseover', function(){
      sound.classList.add('light')
    })
    bind(sound, 'mouseout', function(){
      sound.classList.remove('light')
    })
}

  // 将显示音量进度条与音量绑定
var vol = parseInt(Math.floor(a.volume * 100) / 100)
var loud = function(event){
    var sound = get('.sound')
    var soundfloat = get('.soundFloat').childNodes[0]
    soundfloat.height = vol * 100
    bind(sound, 'mousewheel', function(event){
      var s = event.wheelDelta
      if(s > 0){
        vol = vol + 0.1
        if (vol >= 1) {
          vol = 1
        }
        a.volume = vol
        soundfloat.height = vol * 100
        log('222', vol)
        log(soundfloat.height)
        // soundSchedule()
      }
      if(s < 0) {
        vol = vol - 0.1
        if (vol <= 0) {
          vol = 0
        }
        a.volume = vol
        soundfloat.height = vol * 100
        log('111222', vol)
      }

    })
}

//播放结束时切换歌曲
var __main = function(){
    bindMenu()
    bindChangeSong()
    playSong()
    songSchedul()
    bindLight()
    loud()
}
__main()
