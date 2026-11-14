# Laboratorio di ascolto ORBIT

[A+ al pianoforte · selezione di cinque scene](piano-naturale/cinque-scene/README.md). Il riferimento per Sarychev è la frase di 22 tocchi.

[Terra-Sonify](terra-sonify/README.md). Due brani ambient dal Fuji e dalla Florida con percorso di Hilbert e sintesi FM.

Sul [Monte Fuji](cinque-flauti/fuji-2013.jpg) puoi confrontare il [violoncello sintetico](timbri/fuji-violoncello.wav), il [vetro sfregato sintetico](timbri/fuji-vetro.wav) e il [flauto](cinque-flauti/fuji-2013.wav). Stessa partitura di 12 secondi e volume integrato allineato a −20,6 LUFS.

[Cinque note di flauto](cinque-flauti/README.md). Un solo suono continuo segue la fascia che si distingue di più dalle altre.

[Partitura RGB reversibile](partitura-rgb/README.md). Tre immagini, una regola fissa e ricostruzione dal WAV della griglia di ascolto.

[Tre voci e profondità sul Pacifico](rilievo/README.md). Confronto fra due date e prova di posizione verticale.

[Linea continua sul Pacifico](linea-continua/README.md). Una sola voce tenuta, guidata dal colore predominante.

[Arpeggio dalle sei immagini NASA](mappe-nasa/README.md). Due confronti e sei giri in loop dalla stessa scansione musicale.

## Esperimenti sintetici

Esperimenti per scegliere una direzione sonora. Non sono codice del prodotto, dati NASA o evidenza di accessibilità verificata. I tre esempi sintetici documentano la ricerca timbrica. Il metodo scelto per la demo è il pianoforte A+.

Ogni file dura 17 secondi: A da 0 a 8 s, pausa di mezzo secondo, B da 8,5 a 16,5 s, coda silenziosa. Sono due campi sintetici di otto valori firmati senza unità fisica; in B aumenta il valore nelle posizioni centrali e a destra. Ordine, scala e guadagno restano uguali fra A e B dello stesso algoritmo.

- [Canone orbitale](canone-orbitale.wav): scansione con risposta ritardata all'ottava.
- [Marea spettrale](marea-spettrale.wav): distribuzione dei valori trasformata in un accordo che respira. Perde la disposizione spaziale: è un limite intenzionale da valutare.
- [Arcipelago risonante](arcipelago-risonante.wav): gruppi contigui oltre soglia diventano risonanze. Qui i gruppi sono su una linea; la segmentazione di una mappa 2D non è implementata.

Il silenzio fra A e B serve a distinguerli. Questi file NON dimostrano la continuità del futuro loop. L'attenuazione ai bordi è propria dell'esempio, non una proposta per ogni giro del prodotto.

Rigenerazione: `node render-experiments.cjs` da questa cartella; Node senza dipendenze esterne. Parametri e input sono nel sorgente; `measurements.json` contiene le misure digitali. I file non sono equiparati per volume percepito fra algoritmi: non preferire una variante soltanto perché sembra più forte. Nessun giudizio di gradevolezza viene dedotto da queste misure.

Ascolto da svolgere: stesso volume, poi prova in mono; annotare preferenza timbrica, affaticamento, differenza percepita fra A e B e ciò che si pensa sia cambiato. Solo dopo una prima scelta, preparare prove con risposte nascoste e ordine alternato. Il confronto attuale è dimostrativo, non un test cieco.

La cartella è un esperimento preparatorio separato. La sua ammissibilità come materiale riutilizzabile nell'evento deve essere verificata sulle regole ufficiali; non va presentata come creata durante l'hackathon.
