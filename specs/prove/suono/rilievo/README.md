# Ascoltare il rilievo della mappa

[Gennaio](gennaio.wav) e [ottobre](ottobre.wav) seguono da sinistra a destra la stessa zona del Pacifico in 12 secondi. Per seguire l'immagine durante l'ascolto aprire il ritaglio corrispondente: [gennaio](../linea-continua/gennaio-ritaglio.png) o [ottobre](../linea-continua/ottobre-ritaglio.png). I colori provengono dalla [serie NASA SVS 5176](https://svs.gsfc.nasa.gov/5176/).

## Tre indicazioni all’ascolto

- Il tempo dà la posizione da ovest a est. A metà del giro la lettura raggiunge metà del ritaglio.
- Tre voci continue leggono simultaneamente tre fasce della stessa altezza. Dal basso verso l’alto si sentono un Re3, un La3 e un Mi4. Il registro di ciascuna fascia rimane fisso lungo il percorso.
- Il lato blu della legenda produce un suono rotondo di flauto, il lato caldo un suono di ancia con armonici più presenti. I colori vicini al centro producono un suono tenue con più riflessioni. Le anomalie cromatiche marcate emergono in primo piano. La profondità è una convenzione sonora applicata ai colori della visualizzazione. Dati di profondità oceanica e valori esatti in °C richiederebbero altre informazioni.

## Prova della posizione verticale

[Originale e capovolgimento verticale](prova-alto-basso.wav). Si ascolta per sei secondi il tratto centrale di gennaio (secondi 3–9), seguono 0,5 secondi di pausa e gli stessi sei secondi letti dopo aver scambiato alto e basso. Il secondo passaggio è una trasformazione di laboratorio dell’originale. Ogni colonna contiene esattamente gli stessi pixel. La fascia centrale conserva i suoi colori, le altre due si scambiano. Seguire il timbro rotondo e quello brillante e provare a dire su quale registro si trovano nei due passaggi. In cuffia si può giudicare anche la distanza apparente. In mono i due passaggi mantengono segnali differenti. La riconoscibilità del cambiamento e il comfort all’ascolto richiedono una prova con persone.

## Riproduzione dell’esperimento

Eseguire `node genera.cjs` in questa cartella con FFmpeg disponibile. L’ingresso è il ritaglio RGB verificato contro gli originali. Il generatore usa gli stessi 65 campioni della legenda e gli stessi criteri di esclusione dei colori incerti della prova a linea singola. Per ogni pixel valido la posizione nella legenda è espressa come z tra −1 e +1. La radice di |z| pesa il contributo freddo o caldo, il resto alimenta la voce neutra. Si sommano separatamente e si dividono per l’altezza della fascia, includendo nel denominatore i pixel esclusi. In ogni posizione il suono conserva quindi sia colori caldi sia colori freddi quando coesistono. Una media su 19 colonne e un’interpolazione per campione rendono i passaggi continui.

Le tre voci usano registri separati e poche armoniche. Riflessioni stereo fra 19 e 83 ms sono più presenti nella parte neutra. Un raccordo di 180 ms chiude il loop come nella prova a linea singola. Le stesse regole e lo stesso guadagno valgono per entrambe le mappe. Due esecuzioni hanno dato file identici. Il test verifica lo scambio esatto delle fasce sulla griglia e la differenza rimane misurabile nella somma mono.

La risoluzione verticale è di tre fasce. Due regioni che si scambiano di posto all’interno della stessa fascia e colonna danno lo stesso suono. La prova riguarda il Pacifico. La palette delle luci della Florida richiede una mappatura dedicata.
