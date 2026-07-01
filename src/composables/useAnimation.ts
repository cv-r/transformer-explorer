/**
 * 动画 Composable
 *
 * 提供统一的动画控制功能
 * 支持：播放、暂停、步进、速度控制
 */

import { ref, onUnmounted } from 'vue'

export function useAnimation(totalFrames: number = 30, speed: number = 500) {
  const isPlaying = ref(false)
  const currentFrame = ref(0)
  const animationSpeed = ref(speed)
  let timer: number | null = null

  /**
   * 播放动画
   */
  function play(): void {
    if (isPlaying.value) return
    isPlaying.value = true

    const tick = () => {
      if (currentFrame.value < totalFrames - 1) {
        currentFrame.value++
        timer = window.setTimeout(tick, animationSpeed.value)
      } else {
        pause()
      }
    }

    tick()
  }

  /**
   * 暂停动画
   */
  function pause(): void {
    isPlaying.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  /**
   * 重置动画
   */
  function reset(): void {
    pause()
    currentFrame.value = 0
  }

  /**
   * 下一帧
   */
  function nextFrame(): void {
    if (currentFrame.value < totalFrames - 1) {
      currentFrame.value++
    }
  }

  /**
   * 上一帧
   */
  function prevFrame(): void {
    if (currentFrame.value > 0) {
      currentFrame.value--
    }
  }

  /**
   * 跳转到指定帧
   */
  function goToFrame(frame: number): void {
    currentFrame.value = Math.max(0, Math.min(frame, totalFrames - 1))
  }

  /**
   * 设置速度
   */
  function setSpeed(newSpeed: number): void {
    animationSpeed.value = newSpeed
    if (isPlaying.value) {
      pause()
      play()
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    pause()
  })

  return {
    isPlaying,
    currentFrame,
    animationSpeed,
    totalFrames,
    play,
    pause,
    reset,
    nextFrame,
    prevFrame,
    goToFrame,
    setSpeed,
  }
}
