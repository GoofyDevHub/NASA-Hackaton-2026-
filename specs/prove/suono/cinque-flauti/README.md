# Cinque note, un flauto

La linea attraversa in 12 secondi lo stesso ritaglio del Pacifico. Ogni fascia può azionare una nota del flauto. Un solo oscillatore effettua i passaggi fra le cinque altezze, mantenendo continui il fiato e la fase.

| Immagine | Ascolto | Un punto da cercare |
|---|---|---|
| [Gennaio](../linea-continua/gennaio-ritaglio.png) | [Flauto di gennaio](gennaio.wav) | Fra 7,35 e 7,90 secondi la linea passa alla fascia più bassa e poi risale. |
| [Ottobre](../linea-continua/ottobre-ritaglio.png) | [Flauto di ottobre](ottobre.wav) | Fra 5,30 e 10,50 secondi mantiene la nota più alta. |

## Ascolti su montagne e luci notturne

Ogni ascolto dura 12 secondi con gli stessi cinque registri, timbro, soglie e scansione del Pacifico.

| Scena | Immagine letta | Audio |
|---|---|---|
| Monte Fuji, 29 dicembre 2013 | [Landsat 8](fuji-2013.jpg) | [Flauto](fuji-2013.wav) |
| Monte Fuji, 1 gennaio 2021 | [Landsat 8](fuji-2021.jpg) | [Flauto](fuji-2021.wav) |
| Florida, 30 agosto 2022 | [Ritaglio prima di Ian](florida-prima.png) | [Flauto](florida-prima.wav) |
| Florida, 30 settembre 2022 | [Ritaglio dopo Ian](florida-dopo.png) | [Flauto](florida-dopo.wav) |

Le due immagini integrali del Fuji sono di Joshua Stevens per NASA Earth Observatory, su dati Landsat USGS. Il confronto riguarda i contrasti visivi nelle due riprese. [Fonte NASA](https://science.nasa.gov/earth/earth-observatory/mount-fujis-missing-snow-147780/)

Per la Florida si usa il medesimo ritaglio del pannello sinistro (origine 96, 240, dimensioni 1728 × 1512 nei PNG originali; riduzione per area a 864 × 756). Luci, fondale e scritte presenti nel ritaglio contribuiscono al contrasto. Credito NASA's Scientific Visualization Studio. [Fonte NASA](https://svs.gsfc.nasa.gov/5058/)

## Regola proposta

Ogni istante si cerca la fascia che più si distingue dalle altre quattro. La differenza può dipendere dal colore o dalla luminosità. Il colore prevalente dell’intera foto e il soggetto rappresentato non richiedono impostazioni. Se una striscia chiara attraversa uno sfondo scuro in diagonale dal basso verso l’alto, il flauto segue il movimento dal grave all’acuto. Una superficie uniforme genera silenzio anche se è molto luminosa.

Per ogni immagine si calcolano le medie RGB su 240 colonne e cinque fasce uguali in altezza. Per ogni colonna il riferimento è la mediana per canale dei cinque colori medi. La distanza euclidea RGB da questo riferimento, divisa per 255√3, dà il punteggio di ciascuna fascia. Dal basso verso l’alto le note sono Re4, Fa4, Sol4, La4, Do5.

- Una nota entra da silenzio se il punteggio massimo raggiunge 0,065. Cede il posto se la sfidante supera quello della fascia attiva di oltre 0,035 e raggiunge la soglia di ingresso. Se tutti i punteggi scendono sotto 0,045 il flauto sfuma.
- Un cambio richiede sei letture consecutive della stessa decisione, su una griglia temporale di 50 ms. Una parità mantiene la fascia attiva quando è tra le migliori; se occorre scegliere fra più nuove candidate equivalenti si usa la prima dall’alto.
- L’altezza scivola verso la nota della nuova fascia (costante di tempo 55 ms); il fiato segue con 45 ms. Le armoniche restano solidali con l’unica nota. La prova mono ha una breve dissolvenza alle estremità del file. La continuità fra giri in loop resta da valutare nel lettore.

Una forma sottile può perdersi nella media di fascia e due forme simultanee competono per la stessa voce. Sono scelte esplicite di questa sintesi. Le soglie sono comuni ai due esempi. Mappatura deterministica, diversi ingressi possono produrre la stessa melodia. La piacevolezza richiede ascolto.

Rigenerare con Node e FFmpeg mediante `node genera.cjs`. Il programma verifica che una superficie uniforme resti silenziosa e che un contrasto trasferito dalla fascia bassa a quella alta cambi registro. Stampa gli istanti dei cambi sui due ritagli. [Sorgente](genera.cjs)
