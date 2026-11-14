# Cinque paesaggi al pianoforte

Cinque brani di 15 secondi sullo stesso Yamaha C5 campionato da Alexander Holm. Percorso di Hilbert e accordatura di A+, 180 segmenti sul raster 64 × 64, stessa dinamica e dissolvenze. Tutti i WAV di ascolto sono pareggiati a −20 LUFS, stereo 48 kHz, PCM 24 bit. Il numero di note indica i tocchi complessivi del pianoforte, comprese le ripetizioni.

## Selezione dopo l’ascolto

Sul Sarychev la versione A+ da 22 tocchi è risultata più interessante. Sono piaciute anche le quattro versioni in tabella. A+ resta il riferimento per nuove immagini; la riduzione dei raddoppi rimane una variante sperimentale.

| Scena | Immagine | Audio |
|---|---|---|
| Bahamas · banchi di sabbia | [JPEG analizzato](immagini/bahamas.jpg) · [Fonte e crediti NASA](https://science.nasa.gov/earth/earth-observatory/ocean-sand-bahamas-2780/) | [Ascolta](bahamas.wav) |
| Namib · dune e fiume Kuiseb | [JPEG analizzato](immagini/namib.jpg) · [Fonte e crediti NASA](https://science.nasa.gov/earth/earth-observatory/where-the-dunes-end-146064/) | [Ascolta](namib.wav) |
| Alaska · ghiacciaio Malaspina in prospettiva | [JPEG analizzato](immagini/malaspina.jpg) · [Fonte e crediti NASA](https://science.nasa.gov/earth/earth-observatory/malaspina-glacier-alaska-2-3421/) | [Ascolta](malaspina.wav) |
| Mauritania · struttura di Richat | [JPEG analizzato](immagini/richat.jpg) · [Fonte e crediti NASA](https://science.nasa.gov/earth/earth-observatory/the-eye-of-sahara-150060/) | [Ascolta](richat.wav) |
| Curili · pennacchio del Sarychev | [JPEG analizzato](immagini/sarychev.jpg) · [Fonte e crediti NASA](https://science.nasa.gov/earth/earth-observatory/ash-eruptions-from-sarychev-peak-kuril-islands-38957/) | [Ascolta · 22 tocchi](sarychev-originale.wav) |

## Variante sperimentale con meno raddoppi

In un brano di 15 secondi con più di 18 attacchi, controllare ogni nota aggiunta da A+. Se anticipa una nota portante entro 0,65 secondi e dista meno di un quarto di semitono, può essere omessa. Rimuovere prima i raddoppi più ravvicinati e fermarsi al raggiungimento di 18 attacchi o quando finiscono i candidati. La soglia è una scelta musicale proposta per questa durata. I cambi veri di altezza e le note portanti sono mantenuti anche quando la densità rimane elevata.

| Scena | A+ originale | Con meno raddoppi | Altezze diverse |
|---|---:|---:|---:|
| Bahamas | 20 | 20 | 8 |
| Namib | 17 | 17 | 4 |
| Malaspina | 28 | 25 | 9 |
| Richat | 22 | 18 | 8 |
| Sarychev | 22 | 18 | 5 |

Il confronto di ascolto comprende il [Sarychev con A+ originale](sarychev-originale.wav) con la [proposta](sarychev.wav). In particolare fra 2 e 5 s sono stati rimossi tre raddoppi. Il Fuji di riferimento conserva i suoi 15 attacchi. I colori delle *immagini pubblicate*, comprese eventuali scritte e la resa prospettica del Malaspina, determinano la lettura musicale. L’ascolto non misura quota, temperatura o intensità vulcanica.

Le partiture sono state estratte due volte in Chrome dal simulatore con le cinque immagini caricate, e i WAV rigenerati due volte con verifica byte per byte. Per riprodurre con i file inclusi, eseguire `python genera.py` con le [dipendenze Python](../../terra-sonify/requirements.txt) e FFmpeg. Per ripetere anche l’estrazione usare `python estrai.py` con Playwright e Chrome. [Misure](misure.json) · [Campioni e attribuzione musicale](../README.md).
