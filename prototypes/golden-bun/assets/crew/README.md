<!-- PROTOTYPE - NOT FOR PRODUCTION -->
# 스탠딩 이미지 넣는 곳

1. 이미지를 이 폴더에 넣습니다. 권장: 가로 3:2 (예: 1216x832), 흰 배경 또는 투명 배경.
2. `../../config.js` 맨 아래 `window.ART` 에 경로를 적습니다.

```js
crew: {
  seongdo:   { neutral: 'assets/crew/seongdo.webp', smile: 'assets/crew/seongdo_smile.webp' },
  minjun:    { neutral: 'assets/crew/minjun.webp' },
  gwangsik:  { neutral: 'assets/crew/gwangsik.webp' },
  gwancheol: { neutral: 'assets/crew/gwancheol.webp' },
  daeheon:   { neutral: 'assets/crew/daeheon.webp' },
  taebeom:   { neutral: 'assets/crew/taebeom.webp' },
},
cg: { minjun3: 'assets/crew/cg_minjun3.webp' },
```

표정 키는 `neutral`, `smile`, `shy`, `surprised` 입니다. 없는 표정은 `neutral` 을 씁니다.
`cg` 의 키는 `story.js` 의 이벤트 id 이며, 적어 두면 그 이벤트 동안 스탠딩 자리에 표시됩니다.
넣은 파일은 `../provenance.yaml` 에 한 줄씩 적어 둡니다 (`origin: you`).
