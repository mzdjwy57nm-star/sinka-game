import type { Register } from 'claude-code'

const NAME = 'lyric-video'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: NAME,
      description: 'Вертикальный лирик-эдит (MP4 1080×1920, 30 fps, без звука) по тексту песни',
      argumentHint: '[текст песни]',
      aliases: ['lyric-edit'],
    })
    return next(e)
  })

  on('command.run', { command: NAME }, async ($, e) => {
    const lyrics = e.args.trim()
    if (!lyrics) {
      return {
        text: 'Добавьте текст песни после команды: /lyric-video <текст>. Можно отметить, где начинается припев, и желаемое настроение фона.',
        isTextDisplayOnly: true,
      }
    }
    const brief = await $.fs.read(`${$.plugin.root}/brief.md`)
    void $.prompt.submit({
      asUser: true,
      text: `Сделай вертикальный лирик-эдит строго по памятке ниже, отрендерь MP4, проверь контактный лист, пришли файл и кратко опиши каждую сцену.\n\n${brief}\n\n## Текст песни\n\n${lyrics}`,
    })
    return { text: 'Задача на лирик-эдит отправлена.', isTextDisplayOnly: true }
  })
}
