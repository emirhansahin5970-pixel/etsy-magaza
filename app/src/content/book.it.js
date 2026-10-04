/*
 * Contenuto del libro (italiano): "Piccoli passi, giornate più chiare"
 * Traduzione di book.tr.js: stessi capitoli e stessi id dei blocchi; la bibliografia è solo in book.tr.js.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.it = {
  lang: "it",
  title: "Piccoli passi, giornate più chiare",
  subtitle: "Una breve lettura e un'agenda giornaliera senza pressioni",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Per cominciare",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "Questo breve libro è scritto per chi cerca di portare a casa la giornata. Per chi si porta dietro tutto insieme, lezioni, lavoro, casa e le notifiche infinite del telefono, e la sera si chiede: «Ma oggi cosa ho fatto?»" },
        { id: "g2", type: "p", text: "Qui non troverai un grande sistema. Niente agende con i colori, niente routine mattutine in venti passaggi, nessuna promessa di cambiare tutto in una notte. Ci sono tre piccole idee: appoggiare da qualche parte quello che hai in testa, scegliere una sola attività principale per oggi e, quando la giornata cambia, poter cambiare anche il piano." },
        { id: "g3", type: "p", text: "Ogni capitolo è abbastanza breve da leggerlo durante un viaggio in autobus. Alla fine di ogni capitolo c'è un esercizio di pochi minuti. Puoi farlo su carta, se preferisci, oppure nell'agenda di questa app." },
        { id: "g4", type: "p", text: "Ogni tanto parlerò di ricerche. Ti chiedo di leggerle non come «la scienza l'ha dimostrato», ma come «con alcune persone, in certe condizioni, si è osservato questo». Quello che dice la ricerca e quello che suggerisco io li troverai in riquadri separati. Sapere quale è quale ti aiuta a decidere cosa portare nella tua vita." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "Non devi tenere tutto a mente",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "Sono le 8:10 del mattino. Giulia è in metro, in piedi vicino alla porta. Con una mano si tiene al sostegno, con l'altra scorre le email sul telefono.",
            "I pensieri non arrivano in ordine. La consegna di venerdì. Il messaggio da scrivere al padrone di casa per l'affitto. Il pacco del reso da portare al punto di ritiro. Il compleanno della mamma la settimana prossima. Il modulo lasciato a metà per la candidatura al tirocinio. E poi ieri sera aveva detto a un'amica: «Ti chiamo domani». Ma quando?",
            "Mentre la metro si avvicina alla fermata, sente una sensazione familiare: sto dimenticando qualcosa, ma cosa? La giornata non è ancora cominciata e lei è già stanca.",
          ],
        },

        { id: "b1-h1", type: "h", text: "La mente è un buon promemoria, ma un pessimo magazzino" },
        { id: "b1-p1", type: "p", text: "Il problema di Giulia non è la pigrizia o il disordine. Il problema è che tutte le cose da fare stanno nello stesso momento nello stesso posto: dentro la sua testa." },
        { id: "b1-p2", type: "p", text: "Una cosa non finita, finché non viene scritta da qualche parte, ogni tanto si fa sentire. Durante una lezione ti torna in mente il pacco del reso, mentre mangi la consegna. A volte questi richiami sono utili. Ma non scelgono né l'ordine né il momento. Una cosa importante e una senza importanza ti chiamano con la stessa voce." },
        { id: "b1-p3", type: "p", text: "Alla fine ti ritrovi con venti pensieri a metà e non riesci a pensarne fino in fondo nemmeno uno. Questo potrebbe essere uno dei motivi per cui passi tutto il giorno a darti da fare e la sera hai l'impressione di non aver fatto niente." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "In una serie di esperimenti, ai partecipanti a cui veniva ricordato un obiettivo non ancora raggiunto la mente tornava più spesso a quell'obiettivo durante una lettura che non c'entrava nulla. Quando veniva permesso loro di fare un piano concreto per lo stesso obiettivo, questo effetto scompariva.",
          limits: "Gli esperimenti sono stati condotti in laboratorio, per lo più con studenti universitari. Nella vita di tutti i giorni il risultato potrebbe non essere lo stesso per tutti.",
          details: "Secondo i ricercatori, a fare la differenza non era solo ricordarsi della cosa da fare, ma costruire un piano concreto per farla. In questo libro scrivere è il primo passo; il piano è l'argomento del secondo capitolo.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "A cosa serve, in pratica, scrivere" },
        { id: "b1-p4", type: "p", text: "Scrivere quello che hai in testa non è una promessa di fare tutte quelle cose. È più come parcheggiarle da qualche parte. Quando l'auto è nel parcheggio non devi continuare a pensarci; ti basta sapere dov'è." },
        { id: "b1-p5", type: "p", text: "Una lista messa su carta fa tre cose concrete. Primo, ti permette di confrontare le cose da fare. In testa sembrano tutte grandi uguali; quando le scrivi, ti accorgi che alcune richiedono due minuti e altre due settimane. Secondo, riduce la paura di dimenticare, perché adesso a ricordare ci pensa la carta. Terzo, rende più facile il passo successivo, cioè decidere cosa scegliere per oggi." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "A sinistra, brevi tratti e cerchi di dimensioni diverse, aggrovigliati tra loro; dal centro una freccia porta a un foglio a destra con righe ordinate. Sul foglio ci sono alcune righe e, accanto a una di esse, un piccolo segno.",
          caption: "In testa tutto si aggroviglia. Sulla carta le stesse cose si mettono in fila e si possono confrontare.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "In uno studio in un laboratorio del sonno, i giovani adulti che prima di dormire avevano scritto per cinque minuti le cose da fare nei giorni successivi si sono addormentati, in media, più in fretta di quelli che avevano scritto le cose completate nei giorni precedenti.",
          limits: "Una sola notte, un piccolo gruppo di 57 persone senza disturbi del sonno. Non dimostra che scrivere faccia bene al sonno di tutti.",
          details: "Anche chi aveva scritto le cose da fare in modo più dettagliato si è addormentato più in fretta. Questo risultato va letto come un indizio che spostare la lista dalla testa alla carta può dare sollievo, non come una conclusione definitiva.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "Non devi riorganizzare tutta la tua vita" },
        { id: "b1-p6", type: "p", text: "A questo punto la prima idea che viene in mente di solito è una grande pulizia: scaricare una nuova app, dividere tutto in categorie, colori, etichette, livelli di priorità. Dopo una settimana il sistema diventa un'altra cosa di cui occuparsi." },
        { id: "b1-p7", type: "p", text: "Non serve. In questo capitolo l'unica cosa che farai è tirare fuori, per qualche minuto, quello che hai in testa. Niente classificazioni, niente ordine, niente piano. A quella parte arriveremo nel secondo capitolo, e anche lì sceglieremo una sola cosa, non venti." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Tieni la lista in un unico posto. Se un giorno scrivi nelle note del telefono, il giorno dopo su un foglio e quello dopo ancora in una bozza di messaggio, la tua mente proverà a ricordare dove sono le liste. Non importa quale sia il posto; importa che sia sempre lo stesso.",
        },

        { id: "b1-p8", type: "p", text: "Può esserti utile sapere anche questo: la tua lista sembrerà disordinata. «Chiamare la mamma» starà proprio sopra «Pensare a cosa fare dopo la laurea». È normale. La lista non serve a essere ordinata, ma a rendere visibile il peso che hai in testa." },
        { id: "b1-h4", type: "h", text: "E se la lista si allunga?" },
        { id: "b1-p10", type: "p", text: "Molte persone che scrivono tutto per la prima volta, guardando la lista che ne esce, fanno per un attimo un passo indietro. Quindici, venti righe. «Ho davvero tutte queste cose da fare?» In realtà quelle cose c'erano già; solo che adesso si possono contare." },
        { id: "b1-p11", type: "p", text: "Una lista lunga non significa che devi fare tutto oggi. Alcune righe si risolvono con un messaggio, altre sono questioni che dureranno mesi, altre ancora non sono affatto cose da fare, ma preoccupazioni: «Riuscirò a trovare un tirocinio?» Per ora non devi fare niente per separarle. Già vedere che non sono tutte dello stesso tipo può alleggerire un po' il peso." },
        { id: "b1-p12", type: "p", text: "Mentre scrivi, potrebbero venirti in mente anche cose che non hai voglia di scrivere. Non è obbligatorio scrivere tutto. Questa lista non la vedrà nessuno; non serve a metterti alla prova, ma a liberare un po' di spazio nella tua testa." },
        { id: "b1-p13", type: "p", text: "E potresti notare anche questo: alcune cose, appena scritte, si rimpiccioliscono. «Messaggio al padrone di casa» in testa sembra una lunga conversazione, sulla carta diventa un messaggio di due frasi. Non succede con tutto, ma quando succede fa bene." },
        { id: "b1-p9", type: "p", text: "Quella mattina, scesa dalla metro, Giulia ha scritto per tre minuti nelle note del telefono tutto quello che le veniva in mente. Sono uscite quattordici righe. Sul momento non ne ha fatta nessuna. Ma quando ha visto che avrebbe chiamato la sua amica in pausa pranzo e che avrebbe lasciato il pacco del reso al punto di ritiro tornando a casa la sera, il resto si è fatto un po' più silenzioso." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "Svuotare la testa in tre minuti",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Imposta un timer di tre minuti. Puoi usare anche il pulsante qui sotto.",
            "Scrivi ogni cosa da fare che ti viene in mente, in breve e senza ordine. Non distinguere tra grandi e piccole: «Messaggio affitto», «Compito», «Appuntamento dal dentista».",
            "Non scrivere frasi che iniziano con «Dovrei»; basta il nome della cosa.",
            "Quando il timer finisce, fermati. La lista può restare incompleta; quello che manca si può aggiungere dopo.",
            "Per ora non devi fare niente con la lista. Ti basta sapere che è lì.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Scrivere da qualche parte le cose che hai in testa non ti obbliga a farle subito; ti permette solo di smettere di portarle tutte insieme.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Dai a oggi un'attività principale",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Martedì mattina, le 10:00. Giulia è in biblioteca, al tavolo vicino alla finestra. Davanti a sé ha la lista di ieri: quattordici righe.",
            "Prima apre il file della consegna. Dopo qualche minuto si ricorda della scadenza del modulo per il tirocinio e apre il modulo. Mentre cerca il documento richiesto, le viene in mente di controllare entro quando va fatto il reso. Poi torna alla consegna.",
            "Verso mezzogiorno sullo schermo ci sono sette schede aperte. Nessuna cosa è finita. Giulia sa di aver lavorato tutta la mattina, ma non ha niente da mostrare.",
          ],
        },

        { id: "b2-h1", type: "h", text: "Una lista non è un piano" },
        { id: "b2-p1", type: "p", text: "Nel primo capitolo hai scritto da qualche parte quello che avevi in testa. Questo alleggerisce il carico; ma non ti dice da cosa cominciare oggi. Una lista è un inventario. Chi guarda quattordici righe tutte insieme può cominciare a pensare che ognuna sia più urgente dell'altra." },
        { id: "b2-p2", type: "p", text: "La mattina di Giulia è andata proprio così. Ogni cosa era valida, ogni passaggio aveva senso. Ma passando da una cosa all'altra, ogni volta ha dovuto ricordarsi di nuovo dove era rimasta. La giornata si è riempita di inizi lasciati a metà." },
        { id: "b2-p3", type: "p", text: "Quello che ti propongo in questo capitolo è semplice: per ogni giornata scegli un'attività principale. Non deve essere la cosa più importante della tua vita. Il criterio è questo: se stasera questa cosa sarà finita o andata avanti, sarà un sollievo per te? Se la risposta è sì, quella è l'attività principale di oggi." },
        { id: "b2-p4", type: "p", text: "Le altre cose non spariscono; aspettano nella lista. Scegliere un'attività principale non significa rinunciare alle altre, ma rimandare la decisione su quando occupartene." },

        { id: "b2-h5", type: "h", text: "Quando scegliere è difficile" },
        { id: "b2-p12", type: "p", text: "Certe mattine due o tre cose sembrano urgenti allo stesso modo. In giornate così, alcune domande possono rendere la scelta più facile. Quale ha la scadenza più vicina? Quale, se non viene finita, blocca anche altre cose? A quale pensi e senti più peso sul petto?" },
        { id: "b2-p13", type: "p", text: "Queste domande non sempre hanno una risposta chiara. Allora anche tirare una moneta può essere meglio che non scegliere affatto. Scegliere l'attività principale sbagliata spesso stanca meno che passare tutto il giorno avanti e indietro tra tre cose, perché almeno una va avanti." },
        { id: "b2-p14", type: "p", text: "E poi c'è questo: l'attività principale non deve essere ogni giorno una cosa grande. In una giornata di stanchezza, appena dopo un esame o quando non stai bene, l'attività principale può essere «Fare il bucato». L'attività principale si sceglie in base alle forze della giornata, non a quelle della persona che vorresti essere." },

        { id: "b2-h2", type: "h", text: "Trasformare l'attività principale in un piccolo passo" },
        { id: "b2-p5", type: "p", text: "«Scrivere la relazione» può essere una buona attività principale, ma è un pessimo punto di partenza. È troppo grande; non sai da che parte prenderla. Quello che rende più facile cominciare è il primo piccolo passo dell'attività principale: un gesto abbastanza concreto da poterlo fare in pochi minuti." },
        { id: "b2-p6", type: "p", text: "Qualche esempio: invece di «Scrivere la relazione», «Aprire il file e scrivere tre titoli». Invece di «Candidatura per il tirocinio», «Trovare il documento che manca nel modulo e metterlo nella cartella». Invece di «Parlare con il padrone di casa», «Scrivere la prima frase del messaggio sull'affitto»." },
        { id: "b2-p7", type: "p", text: "Lo scopo del primo passo non è finire la cosa, ma entrarci dentro. A volte, finito il primo passo, vai avanti; a volte no. Vanno bene entrambe le cose. Ma c'è differenza tra restare davanti a una pagina bianca e tornare a una pagina con tre titoli già scritti." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "A sinistra, un grande riquadro con alcune righe all'interno; una freccia porta a quattro piccoli gradini che salgono verso destra. Sopra il primo gradino, il più basso, c'è un punto arancione.",
          caption: "Una cosa grande non si supera con un salto solo. Il primo gradino deve essere abbastanza basso da poterlo salire oggi.",
        },

        { id: "b2-h3", type: "h", text: "Quando e dove?" },
        { id: "b2-p8", type: "p", text: "Dopo aver scelto il primo passo resta ancora una domanda: quando e dove lo farai? «Oggi, prima o poi» spesso scivola fino a fine giornata. «Dopo pranzo, al piano di sopra della biblioteca», invece, nella tua testa diventa come un appuntamento." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "I piani che lo psicologo Peter Gollwitzer ha chiamato «intenzioni di implementazione» consistono nello stabilire in anticipo quando, dove e come mettere in pratica un obiettivo: «Quando si verifica la situazione X, farò Y». In una meta-analisi che ha riunito 94 test indipendenti, la percentuale di partecipanti che raggiungevano i propri obiettivi era, in media, nettamente più alta tra chi aveva fatto questo tipo di piano rispetto a chi si era limitato a fissare un obiettivo.",
          limits: "L'entità dell'effetto variava da uno studio all'altro, e una parte delle ricerche è stata condotta in laboratorio o con studenti. Un effetto medio non dimostra che il piano funzioni per tutti e per ogni cosa.",
          details: "Secondo i ricercatori, piani di questo tipo rendono più facile cominciare quando arriva il momento, perché la decisione «quando comincio?» è già stata presa in anticipo. In questo libro, la sezione «Scegli quando iniziare» in «Giornata» si basa su questa idea.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Prova a legare il momento non a un orario, ma a qualcosa che succede già nella tua giornata: «Dopo la prima lezione», «Dopo aver preparato il caffè», «Quando torno a casa e poso lo zaino». Gli orari slittano; momenti come questi, invece, nella maggior parte dei giorni arrivano comunque.",
        },

        { id: "b2-h4", type: "h", text: "Attività extra e cose che restano per domani" },
        { id: "b2-p9", type: "p", text: "Oltre all'attività principale, durante la giornata ci saranno anche piccole cose da fare. In «Giornata» per queste ci sono solo due spazi. Può sembrare un limite; in realtà è una misura. Se ti servono più di due righe, forse oggi è già una giornata piena, ed è naturale che qualcosa resti per domani." },
        { id: "b2-p10", type: "p", text: "Una cosa che resta per domani non è un fallimento, è una decisione. Il fatto che resti nella lista significa che non è stata dimenticata." },
        { id: "b2-p11", type: "p", text: "Quel giorno, dopo pranzo, Giulia ha chiuso tutte le schede. La sua attività principale era la consegna; il primo passo era aprire il file e scrivere tre titoli. Si è seduta a un tavolo libero al piano di sopra. I titoli le hanno preso dieci minuti. Poi, sotto il primo titolo, ha scritto ancora qualche paragrafo. Il modulo del tirocinio e il reso sono diventati le attività extra del giorno dopo." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "L'attività principale di oggi",
          planner: "main",
          steps: [
            "Guarda la tua lista e chiediti: quale di queste cose, se stasera fosse andata avanti, mi darebbe sollievo?",
            "Scrivi quella cosa come attività principale di oggi.",
            "Sotto, scrivi il primo piccolo passo con cui puoi cominciare in pochi minuti.",
            "Se vuoi, aggiungi anche quando e dove comincerai: per esempio «Dopo pranzo, alla mia scrivania».",
            "Le altre cose possono aspettare nella lista. Per oggi basta così.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "Una sola attività principale per oggi e un suo piccolo primo passo spesso rendono più facile cominciare che provarci guardando una lunga lista.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Adatta il piano alla tua vita",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Giovedì. Il piano di Giulia era chiaro: dopo pranzo, in biblioteca, la seconda parte della consegna.",
            "Ma la riunione del gruppo è andata per le lunghe. All'uscita ha cominciato a piovere. Quando è arrivata a casa erano passate le sei; bagnata, stanca e anche un po' nervosa.",
            "La frase che le è passata per la testa era familiare: «Ormai oggi è andata. Domani comincio come si deve.»",
          ],
        },

        { id: "b3-h1", type: "h", text: "Quando il piano salta" },
        { id: "b3-p1", type: "p", text: "Il piano fatto al mattino è una previsione su come andrà la giornata. Le riunioni si allungano, gli autobus fanno ritardo, l'energia finisce prima del previsto. Se il piano non regge, non è un errore di chi l'ha fatto; le previsioni sono fatte così." },
        { id: "b3-p2", type: "p", text: "Spesso il problema non è il piano saltato, ma il pensiero «tutto o niente» che arriva subito dopo. Se il piano non si può seguire alla lettera, sembra che non si possa seguire per niente. Eppure, nella maggior parte delle giornate, le possibilità sono tre." },
        { id: "b3-p3", type: "p", text: "La prima è spostare il momento: «Il pomeriggio non è andato, mezz'ora dopo cena». La seconda è rimpicciolire il passo: «Non riesco a scrivere la seconda parte, ma posso rileggere una volta i miei appunti». La terza è rimandare di proposito: «Oggi non lo faccio; domattina è la prima cosa». Tutte e tre sono decisioni. La giornata persa, invece, è quella in cui non si decide niente." },

        { id: "b3-h2", type: "h", text: "Un'opzione più piccola per i giorni difficili" },
        { id: "b3-p4", type: "p", text: "In una giornata che va bene il primo passo è facile. Il piano viene messo alla prova soprattutto nei giorni difficili. Per questo può essere utile stabilire in anticipo un'«opzione più piccola»: un piano di riserva così piccolo da poterlo fare anche in una brutta giornata." },
        { id: "b3-p5", type: "p", text: "Per la consegna può voler dire aprire il file e scrivere una sola frase. Per una camminata, uscire di casa e fare un giro di cinque minuti. Per la lettura, una pagina. L'opzione più piccola non serve a far finta di aver fatto la cosa, ma a non perdere il contatto con essa." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "Un sentiero tratteggiato va da sinistra a destra e prosegue curvando attorno a un ostacolo al centro. In basso ci sono sette piccoli quadrati; quasi tutti pieni, uno vuoto, e accanto all'ultimo un punto arancione.",
          caption: "Il piano può girare attorno all'ostacolo. Se uno dei sette giorni resta vuoto, non vuol dire che la strada sia finita.",
        },

        { id: "b3-h3", type: "h", text: "Saltare un giorno" },
        { id: "b3-p6", type: "p", text: "Quando si prova una nuova abitudine, a molte persone saltare un giorno sembra voler dire dover ricominciare tutto da capo. I contatori di serie alimentano proprio questa sensazione: una catena di trenta giorni si azzera in un giorno solo." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "In uno studio condotto a Londra, 96 volontari hanno scelto un comportamento legato al mangiare, al bere o al movimento da fare ogni giorno nella stessa situazione e, per 12 settimane, hanno valutato ogni giorno da soli quanto quel comportamento fosse diventato automatico. Saltare una singola occasione non ha compromesso in modo marcato il processo di formazione dell'abitudine. Il tempo necessario perché il comportamento diventasse quasi automatico è stato molto diverso da persona a persona: tra 18 e 254 giorni.",
          limits: "Un piccolo gruppo di volontari e comportamenti quotidiani semplici. L'automaticità è stata misurata con la valutazione dei partecipanti stessi, e i dati di alcuni partecipanti non si adattavano bene al modello. Con comportamenti più complessi i risultati potrebbero essere diversi.",
          details: "Nello studio il tempo mediano era di 66 giorni; ma non è una media, e non è nemmeno un traguardo. Il risultato fa pensare che tempi fissi come «un'abitudine in 21 giorni» non vadano bene per tutti e che saltare ogni tanto un giorno non azzeri il processo.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "Quando provi un'abitudine, comincia con una breve prova di sette giorni. Lo scopo non è prendere l'abitudine in sette giorni, ma vedere se il momento, il luogo e il passo che hai scelto fanno per te. Cambiare il piano alla fine dei sette giorni fa parte dell'esperimento.",
        },

        { id: "b3-h5", type: "h", text: "Se il piano non fa per te" },
        { id: "b3-p10", type: "p", text: "A volte il problema non è una singola brutta giornata. Se lo stesso piano non regge per diversi giorni di fila, può essere il segno che sei tu a cercare di adattarti al piano, e non il piano ad adattarsi a te. Per chi ha deciso di correre alle sette del mattino ma ogni mattina spegne la sveglia, la vera domanda forse non è «Perché non ci riesco?», ma «Quest'ora va davvero bene per me?»" },
        { id: "b3-p11", type: "p", text: "Quando cambi il piano puoi guardare tre cose: il momento, il luogo e la grandezza del passo. Spesso basta cambiarne una. La sera invece della mattina, la biblioteca invece di casa, dieci minuti invece di mezz'ora. L'obiettivo può restare lo stesso; cambia solo la strada per arrivarci." },
        { id: "b3-p12", type: "p", text: "Mentre fai questi cambiamenti, può aiutare guardarti come qualcuno che sta conducendo un esperimento. Gli esperimenti a volte non danno il risultato atteso; questo non significa che chi li conduce abbia fallito, ma solo che si capisce cosa cambiare nel tentativo successivo." },

        { id: "b3-h4", type: "h", text: "Due domande la sera" },
        { id: "b3-p7", type: "p", text: "A fine giornata, invece di contare quanta parte del piano si è realizzata, prova a farti due domande: Cosa ha funzionato oggi? Cosa posso rendere più facile domani? La prima ti aiuta a notare quello che ha funzionato. La seconda corregge un po' il piano del giorno dopo in base all'esperienza di oggi." },
        { id: "b3-p8", type: "p", text: "Le risposte possono essere piccole: «Mettere il telefono in un'altra stanza ha funzionato». «Domani preparo lo zaino la sera prima». È così che i piani si adattano alla vita: con piccole correzioni, giorno dopo giorno." },
        { id: "b3-p9", type: "p", text: "Quel giovedì sera Giulia ha aperto il file della consegna e ha scritto una sola frase per la seconda parte. Poi è andata a dormire. La mattina dopo, quando ha aperto il file, invece di una pagina bianca l'aspettava una frase." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "Una piccola prova di sette giorni",
          planner: "habit",
          steps: [
            "Scegli una sola abitudine che vuoi provare.",
            "Scrivi il suo inizio più piccolo possibile: abbastanza piccolo da poterlo fare anche in una brutta giornata.",
            "Legalo a un momento che c'è già nella tua giornata e decidi dove lo farai.",
            "Aggiungi un'opzione più piccola per i giorni difficili.",
            "Per sette giorni, ogni sera segna soltanto: l'ho fatto, ho fatto la versione più piccola oppure non l'ho fatto. Poi riguarda il tuo piano.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "Quando il piano salta, invece di lasciarlo perdere spesso si può spostare il momento o rimpicciolire il passo; e saltare un giorno non vuol dire che la strada sia finita.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Per concludere",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "In questo libro c'erano tre piccole idee: appoggiare da qualche parte quello che hai in testa, scegliere per oggi una sola attività principale e il suo primo passo, e poter cambiare il piano quando cambia la giornata." },
        { id: "k2", type: "p", text: "Nessuna di queste renderà facile ogni giornata. Certi giorni la lista resterà lunga, l'attività principale non andrà avanti, la prova si incepperà. Questo non significa che abbia fallito il metodo, né che abbia fallito tu. Il giorno dopo puoi scegliere di nuovo un'attività principale." },
        { id: "k3", type: "p", text: "L'agenda e la sezione dell'abitudine restano qui anche dopo che avrai finito di leggere il libro. Un giorno puoi aprirla e scrivere solo l'attività principale di oggi, un altro giorno puoi anche non aprirla affatto. I tuoi dati restano solo su questo dispositivo; ricordati di fare ogni tanto un backup." },
        { id: "k4", type: "p", text: "I piccoli passi non risolvono tutto. Ma nella maggior parte dei giorni possono bastare per cominciare." },
      ],
    },
  ],
};
