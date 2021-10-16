(function (window) {
  const canvas = document.getElementById('canvas')
  const btn = document.getElementById('btn')

  const { width: canvasWidth, left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect()

  const ctx = canvas.getContext('2d')

  let raf = null
  let isBallRunning = false
  let ifDown = false
  // let can

  const generateBricksNum = 30
  const generatedBricks = []
  let firstGenerateBricks = true
  const disapearedBrickIndexes = []

  const ball = {
    x: 50,
    y: 200,
    vx: 7,
    vy: 11,
    radius: 12.5,
    color: 'blue',
    draw: function() {
      // ctx.globalCompositeOperation = 'destination-out'
      ctx.clearRect(0,0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      // ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      paddle.init()
      generateBricks(generateBricksNum)
    }
  }

  const paddle = {
    x: 50,
    y: 550,
    width: 200,
    height: 20,
    radius: 2,
    color: 'grey',
    init: function () {
      ctx.beginPath()
      ctx.fillRect(this.x, this.y, this.width, this.height)
      // ctx.closePath()
      ctx.fillStyle = 'grey'
      ctx.fill()
    },
    draw: function (x, y) {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      paddle.x = x
      paddle.y = y
      this.init()

      ball.draw()
    },
    raf: null,
  }

  function generateBricks(num) {
    const brick = {
      width: 100,
      height: 20,
      color: 'green',
      disapearColor: 'transparent',
    }

    let xMult = 0
    let yMult = 0

    for (let i = 0; i < num; i++) {
      ctx.beginPath()

      if (disapearedBrickIndexes.includes(i)) {
        ctx.strokeStyle = brick.disapearColor
      } else {
        ctx.strokeStyle = brick.color
      }

      if (xMult * brick.width >= 800) {
        xMult = 0
        yMult += brick.height
      }

      ctx.strokeRect(xMult * brick.width, yMult, brick.width, brick.height)
      if (firstGenerateBricks) {
        generatedBricks.push({
          x: xMult * brick.width,
          y: yMult,
          width: brick.width,
          height: brick.height,
        })
      }
      xMult += 1
    }
    firstGenerateBricks = false
  }

  function stopBall() {
    window.cancelAnimationFrame(raf)
    isBallRunning = false
    btn.textContent = 'Start'
    btn.classList.remove('hide')
  }

  function draw() {
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    paddle.init()
    ball.x += ball.vx;
    ball.y += ball.vy;

    const realY = ball.y + ball.vy
    const realX = ball.x + ball.vx

    // Speed up the movement of ball
    // ball.vy *= 0.99;
    // ball.vy += 0.2;

    // set the move boundry
    if (realY > canvas.height) {
      stopBall()
      ifDown = true
      return
    }
    if (realY < 0) {
      ball.vy = -ball.vy
    }
    if (realX > canvas.width || realX < 0) {
      ball.vx = -ball.vx;
    }

    // Check ball touch with bottom paddle
    if (realY > paddle.y
        && realX > paddle.x
        && (realX < (paddle.x + paddle.width))) {
      ball.vy = -ball.vy
    }

    // Check ball touch top bricks
    for (let j = 0; j < generatedBricks.length; j++) {
      const brick = generatedBricks[j]
      const brickBottomY = brick.y + brick.height
      if (ball.y <= brickBottomY && ball.x > brick.x && ball.x < (brick.x + brick.width)) {
        if (!disapearedBrickIndexes.includes(j)) {
          ball.vy = -ball.vy
          disapearedBrickIndexes.push(j)
        }
      }

      // Add other touch cases
      // if ((ball.y + ball.height) )
    }

    // // Check if ball && paddle touched
    // if (ifCollision(ball, paddle)) {
    //   // ball.vy = -ball.vy
    //   ball.vx = -ball.vx
    // }

    raf = window.requestAnimationFrame(draw);
    console.log(ball.x)
    console.log(ball.y)
  }


  btn.addEventListener('click', function() {
    if (isBallRunning) {
      stopBall()
      return
    }

    if (!isBallRunning) {
      if (ifDown) {
        ball.x = 50
        ball.y = 200
      }

      isBallRunning = true
      raf = window.requestAnimationFrame(draw);
      btn.textContent = 'Stop'
      btn.classList.add('hide')
    }
  })

  canvas.addEventListener('mousemove', function(e) {
    // return

    let x = e.clientX - canvasLeft
    x -= paddle.width / 2
    if (x < 0) {
      x = 0
    }
    if (x > (canvasWidth - paddle.width)) {
      x = canvasWidth - paddle.width
    }

    const y = paddle.y
    // let y = e.clientY - canvasTop
    // y -= paddle.height / 2

    paddle.draw(x, y)
  })

  ball.draw()
  paddle.init()

  generateBricks(generateBricksNum)
})(window)
