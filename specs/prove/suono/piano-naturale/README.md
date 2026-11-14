# Pianoforte acustico sul Monte Fuji

Prove di 15 secondi sulla [ripresa del 2021](../cinque-flauti/fuji-2021.jpg). [A · Simulatore](a-simulatore.wav), [B · Terra-Sonify](b-terra-sonify.wav), [riferimento Terra-Sonify FM allo stesso volume](riferimento-terra-sonify.wav).

Il pianoforte usa sei campioni del Yamaha C5 registrato da Alexander Holm, Salamander Grand Piano V3, strato dinamico v3. Operazioni sui campioni: trasposizione, attenuazione, filtro sulle frequenze subsoniche e dissolvenze. [Strumento e autore](https://sfzinstruments.github.io/pianos/salamander/) · [Campioni originali](https://github.com/sfzinstruments/SalamanderGrandPiano/tree/master/Samples) · [Licenza CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) · [Testo della licenza](campioni/LICENSE.txt)

La variante A usa i 180 eventi esportati dal simulatore allegato dopo aver caricato la foto. La variante B ricalcola gli 80 eventi del renderer Python a 128 × 128. Entrambe arrotondano le oscillazioni brevi prendendo la mediana delle note vicine. Un nuovo attacco può seguire dopo circa 0,9 s; per note uguali o molto vicine occorrono almeno 2,3 s. Sul Fuji restano dieci attacchi in A e otto in B. Il sintetizzatore FM, il tappeto subarmonico e il riverbero aggiunto lasciano spazio al decadimento del campione. La luminanza determina il tocco e la posizione X regola uno spostamento stereo moderato. Una breve coda può sovrapporsi alla nota successiva.

Per riprodurre la prova servono Python e FFmpeg. Dalla cartella eseguire con le dipendenze di Terra-Sonify installate: `python genera.py`. Il programma verifica formato, livello integrato e picco reale rileggendo i WAV.

## Densità della frase

L’utente preferisce A per il maggior numero di note. A è il riferimento di ascolto. La [variante più mossa](a-piu-note.wav) conserva i dieci attacchi originali e ne aggiunge cinque nei passaggi in cui la partitura del simulatore segnala un’altezza diversa. Durata, campioni di pianoforte e livello integrato sono gli stessi. Questa variante A+ è il riferimento scelto per il Fuji. Per rigenerarla eseguire `python variante_a.py`.
