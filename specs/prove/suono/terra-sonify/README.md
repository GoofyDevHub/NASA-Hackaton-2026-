# Terra-Sonify

Composizioni di 45 secondi, stereo, 48 kHz, PCM 24 bit. [Fuji](fuji.wav) usa [la ripresa Landsat del 2013](../cinque-flauti/fuji-2013.jpg). [Florida](florida.wav) usa [il ritaglio di Fort Myers prima di Ian](../cinque-flauti/florida-prima.png). [Fuji, NASA Earth Observatory](https://science.nasa.gov/earth/earth-observatory/mount-fujis-missing-snow-147780/) · [Florida, NASA SVS](https://svs.gsfc.nasa.gov/5058/)

## Esecuzione

Dalla cartella di questo documento con Python 3.11:

```sh
python -m pip install -r requirements.txt
python terra_sonify.py -i ../cinque-flauti/fuji-2013.jpg -o fuji.wav
python terra_sonify.py -i ../cinque-flauti/florida-prima.png -o florida.wav -d 45 -r 48000 -p 7
```

Il programma si aspetta immagini opache trattate come sRGB a 8 bit. Prima del ridimensionamento calcola SHA-256 sui byte RGB in ordine di riga e usa tutti i 256 bit per inizializzare default_rng. Per riprodurre esattamente i file condivisi mantenere gli stessi pixel decodificati, parametri e ambiente. Verifica effettuata su Windows x64 con Python 3.11.16, dipendenze in [requirements.txt](requirements.txt) e libsndfile 1.2.2. L'identità binaria tra architetture o versioni diverse delle librerie matematiche rimane da verificare.

## Dall’immagine al suono

Il percorso di Hilbert attraversa tutte le 16.384 celle della griglia 128 × 128. Ogni coppia di celle consecutive condivide un lato. Si dividono i campioni in 240 tratti contigui e si mediano colori CIELAB, posizione e complessità. La complessità combina la norma del gradiente Sobel della luminanza, quella dei due canali cromatici e la dispersione locale di L*. Una compressione logaritmica a riferimento fisso mantiene confrontabili le immagini.

Il colore sceglie un grado della scala lidia: f = 55 × 2^ottava × rapporto, con rapporti 1, 9/8, 5/4, 45/32, 3/2, 5/3, 15/8. I blu scuri alimentano il registro basso, i toni medi il centrale e le regioni molto chiare e poco sature il registro superiore. Il guadagno della voce include il termine 0,18 + 0,82 × (L*/100)^0,85. Quando il gradiente cresce, aumentano gli indici di modulazione FM e la frequenza di taglio del filtro. La coordinata orizzontale regola il panorama stereo. Inviluppi sovrapposti, pedale grave, riverbero e saturazione tanh completano la composizione. Le sorgenti sono oscillatori, senza campioni di rumore. I colori rappresentano proprietà visive del raster: il profilo termico del controller va trattato separatamente.

Rispetto al testo allegato, il seed usa i pixel originali, gli oscillatori FM seguono rapporti interi e altezze senza scordatura, la complessità e il guadagno finale hanno riferimenti comuni. Il riverbero usa blocchi di ritardo. La dissolvenza iniziale e finale di 1,8 s rende questi ascolti tracce autonome: in ripetizione si sentirà il respiro fra i giri.

## Verifica dei master

Ogni file è stato generato due volte, confrontato byte per byte e decodificato. Ogni canale contiene 2.160.000 campioni. SHA-256 del WAV:

- Fuji: 05870eb693ad936b261a07a0ca1a61ab4e50a583bb8079159164537ba2d9ec64
- Florida: 57299a7375a31b7c447a12e958deae271d1c0e05f82df687ac5ebce3b37a75bc
