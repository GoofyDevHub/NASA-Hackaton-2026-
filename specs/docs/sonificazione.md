# Da un'immagine a un suono: cosa significa davvero

## Riferimento musicale scelto per le immagini

A+ trasforma una scena in una frase di pianoforte acustico campionato. Percorre una griglia di 64 × 64 celle lungo la curva di Hilbert. Colore e luminosità guidano le altezze; A+ seleziona una frase portante e aggiunge tocchi quando emerge un cambio di altezza. Con gli stessi pixel, parametri, campioni e ambiente, la generazione è ripetibile. Il ciclo del lettore dura 15 secondi. La playlist avanza di una scena a fine ciclo. In ascolto singolo Ripeti raccorda fine e inizio mantenendo code e livello stabili. Sul Sarychev la frase preferita contiene 22 tocchi. La densità dipende dalla scena. La variante che dirada i raddoppi rimane una variante sperimentale esterna alla demo. Il funzionamento dal sito e la capacità di riconoscere i cambiamenti a orecchio richiedono verifiche dedicate.

## Riprodurre il riferimento A+

1. L’[estrattore](../prove/suono/piano-naturale/cinque-scene/estrai.py) carica il JPEG nel [simulatore di riferimento](../prove/suono/confronto-simulatore/simulatore.html), imposta 15 s ed esporta 180 gruppi in ordine di Hilbert. Le [partiture salvate](../prove/suono/piano-naturale/cinque-scene/partiture.json) riportano per ogni gruppo frequenza, luminosità, complessità e posizione orizzontale. L’impronta identifica il file analizzato.
2. La funzione `phrase` seleziona le note portanti; `enrich` inserisce un tocco aggiuntivo quando emerge un’altezza diversa. Il numero di tocchi deriva dalla scena. Il [renderer](../prove/suono/piano-naturale/genera.py) traspone il campione di pianoforte più vicino, regola tocco e panorama e lascia decadere la nota. [Selezione A+](../prove/suono/piano-naturale/variante_a.py) · [Campioni e licenza](../prove/suono/piano-naturale/README.md).
3. Per verificare il porting, confrontare sullo stesso JPEG l’ordine delle note, le frequenze e gli istanti di attacco. Sul Fuji il riferimento A+ ha 15 tocchi, sul Sarychev 22. Il file `sarychev-originale.wav` usa A+; `sarychev.wav` contiene la variante da 18. Alcuni altri WAV del laboratorio mostrano la riduzione dei raddoppi. Le [misure per scena](../prove/suono/piano-naturale/cinque-scene/misure.json) riportano entrambi i conteggi. [Fuji A+](../prove/suono/piano-naturale/a-piu-note.wav) · [Sarychev A+](../prove/suono/piano-naturale/cinque-scene/sarychev-originale.wav).

### Rigenerazione locale

In una copia del pacchetto, con Python e FFmpeg disponibili, eseguire dalla radice:

```text
python -m pip install -r prove/suono/terra-sonify/requirements.txt
python prove/suono/piano-naturale/variante_a.py
python prove/suono/piano-naturale/cinque-scene/genera.py
```

Per riestrarre anche le partiture dai cinque JPEG servono Chrome e il pacchetto Python Playwright. Eseguire `python prove/suono/piano-naturale/cinque-scene/estrai.py` prima del renderer. Per le prove A/B in app mantenere il guadagno comune. I WAV dimostrativi hanno un livello pareggiato e una dissolvenza di uscita; nel lettore verificare separatamente il raccordo su dieci cicli, evitando una pausa a ogni giro.

[Altri metodi esplorati](../prove/suono/metodi-esplorati.md).
