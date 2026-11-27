import sys, wave, numpy as np
from faster_whisper import WhisperModel
m=WhisperModel(sys.argv[1],device="cpu",compute_type="int8")
w=wave.open(sys.argv[2]); a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
segs,_=m.transcribe(a,language="ru",word_timestamps=True,vad_filter=False,initial_prompt="Твоя сука сосёт. Она мне сосёт. Все эти суки базарят, но эта сука со мною. Поделись своей любовью, ой, между твоей губою. Она говорит: «Отстань», — перехожу эту грань")
for s in segs:
  print(f"SEG {s.start:.2f}-{s.end:.2f} {s.text}")
  for w in s.words: print(f"  {w.start:6.2f} {w.end:6.2f} {w.word}")
