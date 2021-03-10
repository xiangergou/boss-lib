<template>
  <transition name="fade">
    <div id="postmarkloading" class="markloading" style>
      <div class="markloading-main">
        <!-- <img src="./img/loading.gif"> -->
        <div class="spinner">
          <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
        </div>
        <div class="loading">{{ tip }}</div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    tip: {
      type: String,
      default: '加载中......'
    }
  },
  name: 'EpLoadingMask',
  data() {
    return {}
  },
  computed: {},
  watch: {
    tip: {
      handler() {

      },
      immediately: true
    }
  }
}
</script>
<style lang="scss">
.markloading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  /* background: rgba(13, 75, 134, 0.75); */
  background: rgba(0, 0, 0, 0.50);

  .markloading-main {
    position: relative;
    z-index: 1000;
    width: 150px;
    height: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 0 auto;

    /* margin: -100px auto 0 auto;
  width: 200px;
  height: 200px;
  top: 50%;
  filter: drop-shadow(2px 4px 6px black) hue-rotate(45deg); */
  }

  .loading {
    text-align: center;
    font-size: 20px;
    color: #7bf3ff;
    ;
    line-height: 50px;
    text-align: center;
    margin-top: 50px;
  }

  .spinner img {
    width: 100%;
    height: 100%;
  }

  .container1>div,
  .container2>div,
  .container3>div {
    width: 12px;
    height: 12px;
    background-color: #7bf3ff;
    ;
    border-radius: 100%;
    position: absolute;
    -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
    animation: bouncedelay 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .spinner .spinner-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .container2 {
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  .container3 {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }

  .circle1 {
    top: 0;
    left: 0;
  }

  .circle2 {
    top: 0;
    right: 0;
  }

  .circle3 {
    right: 0;
    bottom: 0;
  }

  .circle4 {
    left: 0;
    bottom: 0;
  }

  .container2 .circle1 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .container3 .circle1 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .container1 .circle2 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .container2 .circle2 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  .container3 .circle2 {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }

  .container1 .circle3 {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }

  .container2 .circle3 {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  .container3 .circle3 {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }

  .container1 .circle4 {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }

  .container2 .circle4 {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }

  .container3 .circle4 {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }
}

@-webkit-keyframes bouncedelay {

  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes bouncedelay {

  0%,
  80%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }

  40% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
