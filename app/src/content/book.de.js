/*
 * Buchinhalt (Deutsch): "Kleine Schritte, klarere Tage"
 * Übersetzung von book.tr.js; gleiche Kapitel- und Block-IDs. Das Literaturverzeichnis steht nur in book.tr.js.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.de = {
  lang: "de",
  title: "Kleine Schritte, klarere Tage",
  subtitle: "Eine kurze Lektüre und ein entspannter Tagesplaner",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Bevor es losgeht",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "Dieses kurze Buch ist für alle geschrieben, die versuchen, irgendwie durch den Tag zu kommen. Für alle, die Uni, Job, Haushalt und die endlosen Benachrichtigungen auf dem Handy gleichzeitig tragen und sich abends fragen: „Was habe ich heute eigentlich geschafft?“" },
        { id: "g2", type: "p", text: "Ein großes System findest du hier nicht. Keine farbcodierten Kalender, keine Morgenroutinen mit zwanzig Schritten und kein Versprechen, über Nacht alles zu ändern. Es gibt drei kleine Ideen: das, was dir im Kopf herumgeht, irgendwo ablegen; für heute eine einzige Hauptaufgabe wählen; und den Plan ändern dürfen, wenn sich der Tag ändert." },
        { id: "g3", type: "p", text: "Jedes Kapitel ist kurz genug für eine Busfahrt. Am Ende jedes Kapitels steht eine Übung, die ein paar Minuten dauert. Du kannst sie auf Papier machen oder im Planer dieser App." },
        { id: "g4", type: "p", text: "Ab und zu erwähne ich Studien. Lies sie bitte nicht als „Die Wissenschaft hat bewiesen …“, sondern als „Bei bestimmten Menschen, unter bestimmten Bedingungen hat man Folgendes beobachtet“. Was die Forschung sagt und was ich vorschlage, siehst du in getrennten Kästen. Zu wissen, was was ist, macht es leichter zu entscheiden, was du in dein eigenes Leben übernimmst." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "Du musst nicht alles im Kopf behalten",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "8:10 Uhr morgens. Lena steht in der U-Bahn an der Tür. Mit einer Hand hält sie sich an der Stange fest, mit der anderen scrollt sie auf dem Handy durch ihre E-Mails.",
            "Die Gedanken kommen nicht der Reihe nach. Die Hausarbeit, die am Freitag fällig ist. Die Nachricht an den Vermieter wegen der Miete. Das Rücksendepaket, das zur Post muss. Mamas Geburtstag nächste Woche. Das halb ausgefüllte Formular für die Praktikumsbewerbung. Und gestern Abend hatte sie einer Freundin gesagt: „Ich ruf dich morgen an.“ Wann eigentlich?",
            "Als die Bahn in die Station einfährt, meldet sich ein vertrautes Gefühl: Ich vergesse doch etwas – aber was? Der Tag hat noch nicht mal angefangen, und sie ist schon müde.",
          ],
        },

        { id: "b1-h1", type: "h", text: "Der Kopf erinnert gut, aber er lagert schlecht" },
        { id: "b1-p1", type: "p", text: "Lenas Problem ist weder Faulheit noch Chaos. Das Problem ist, dass alle Aufgaben gleichzeitig am selben Ort liegen: in ihrem Kopf." },
        { id: "b1-p2", type: "p", text: "Eine unerledigte Aufgabe meldet sich immer wieder, solange sie nirgends notiert ist. In der Vorlesung fällt dir das Rücksendepaket ein, beim Essen die Hausarbeit. Manchmal sind diese Erinnerungen nützlich. Aber sie suchen sich weder Reihenfolge noch Zeitpunkt aus. Eine wichtige und eine unwichtige Aufgabe rufen gleich laut." },
        { id: "b1-p3", type: "p", text: "Am Ende hast du zwanzig halbe Gedanken und kannst keinen davon zu Ende denken. Das könnte ein Grund sein, warum man sich den ganzen Tag beschäftigt fühlt und abends trotzdem das Gefühl hat, nichts geschafft zu haben." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "In einer Reihe von Experimenten schweiften Teilnehmende, die an ein unerledigtes Ziel erinnert worden waren, während einer Lesetätigkeit, die damit nichts zu tun hatte, häufiger zu diesem Ziel ab. Durften sie für dasselbe Ziel einen konkreten Plan machen, verschwand dieser Effekt.",
          limits: "Die Experimente fanden im Labor statt, überwiegend mit Studierenden. Im Alltag muss sich bei allen nicht dasselbe Ergebnis zeigen.",
          details: "Laut den Forschenden machte nicht das bloße Erinnern an die Aufgabe den Unterschied, sondern ein konkreter Plan dafür. In diesem Buch ist das Aufschreiben der erste Schritt; der Plan ist Thema des zweiten Kapitels.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "Wozu das Aufschreiben ganz praktisch gut ist" },
        { id: "b1-p4", type: "p", text: "Aufzuschreiben, was dir im Kopf herumgeht, ist kein Versprechen, das alles auch zu erledigen. Es ist eher so, als würdest du es irgendwo parken. Wenn dein Auto auf dem Parkplatz steht, musst du nicht ständig daran denken; es reicht zu wissen, wo es steht." },
        { id: "b1-p5", type: "p", text: "Eine Liste auf Papier leistet drei ganz konkrete Dinge. Erstens kannst du Aufgaben vergleichen. Im Kopf wirken alle gleich groß; auf dem Papier merkst du, dass manche zwei Minuten dauern und andere zwei Wochen. Zweitens lässt die Sorge nach, etwas zu vergessen, denn das Erinnern übernimmt jetzt das Papier. Drittens fällt der nächste Schritt leichter: die Entscheidung, was du dir für heute aussuchst." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "Links kurze, ineinander verknäuelte Linien und Kringel in verschiedenen Größen; von der Mitte führt ein Pfeil zu einem Blatt Papier rechts mit ordentlichen Zeilen. Auf dem Blatt stehen einige Zeilen, neben einer davon ein kleines Häkchen.",
          caption: "Im Kopf verheddert sich alles. Auf dem Papier stellen sich dieselben Aufgaben in eine Reihe und lassen sich vergleichen.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "In einer Studie in einem Schlaflabor schliefen junge Erwachsene, die vor dem Zubettgehen fünf Minuten lang aufschrieben, was sie in den nächsten Tagen erledigen wollten, im Durchschnitt schneller ein als diejenigen, die aufschrieben, was sie in den letzten Tagen erledigt hatten.",
          limits: "Eine einzige Nacht, eine kleine Gruppe von 57 Personen ohne Schlafprobleme. Das zeigt nicht, dass Schreiben jedem beim Schlafen hilft.",
          details: "Wer seine Aufgaben ausführlicher aufschrieb, schlief ebenfalls schneller ein. Dieser Befund ist als Hinweis zu lesen, dass es entlasten kann, die Liste vom Kopf aufs Papier zu bringen – nicht als sicheres Ergebnis.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "Du musst nicht dein ganzes Leben ordnen" },
        { id: "b1-p6", type: "p", text: "An dieser Stelle denkt man meistens zuerst an einen großen Aufräumtag: eine neue App herunterladen, alles in Kategorien einteilen, Farben, Labels, Prioritätsstufen. Eine Woche später ist das System selbst eine weitere Aufgabe, die gepflegt werden will." },
        { id: "b1-p7", type: "p", text: "Das brauchst du nicht. In diesem Kapitel tust du nur eins: ein paar Minuten lang rausholen, was dir im Kopf herumgeht. Kein Sortieren, kein Ordnen, kein Plan. Dazu kommen wir im zweiten Kapitel, und auch dort wählen wir nur eine einzige Aufgabe aus, nicht zwanzig." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Führe die Liste an einem einzigen Ort. Wenn du heute in die Notizen-App schreibst, morgen auf einen Zettel und übermorgen in einen Nachrichtenentwurf, versucht dein Kopf als Nächstes, sich zu merken, wo die Listen sind. Welcher Ort es ist, ist egal; wichtig ist, dass es immer derselbe ist.",
        },

        { id: "b1-p8", type: "p", text: "Und noch etwas, das dir helfen kann: Deine Liste wird unordentlich aussehen. „Mama anrufen“ steht direkt über „Überlegen, was ich nach dem Abschluss mache“. Das ist normal. Die Liste ist nicht dazu da, ordentlich zu sein, sondern um sichtbar zu machen, was dich im Kopf belastet." },
        { id: "b1-h4", type: "h", text: "Und wenn die Liste lang wird?" },
        { id: "b1-p10", type: "p", text: "Viele, die zum ersten Mal alles aufschreiben, schrecken beim Blick auf die fertige Liste kurz zurück. Fünfzehn, zwanzig Zeilen. „So viel habe ich zu tun?“ Dabei waren diese Aufgaben die ganze Zeit schon da; jetzt kann man sie nur zählen." },
        { id: "b1-p11", type: "p", text: "Eine lange Liste heißt nicht, dass du alles heute erledigen musst. Manche Zeilen sind mit einer Nachricht erledigt, manche sind Themen, die dich monatelang begleiten, und manche sind eigentlich gar keine Aufgabe, sondern eine Sorge: „Finde ich überhaupt ein Praktikum?“ Um das auseinanderzuhalten, musst du gerade nichts tun. Schon zu sehen, dass nicht alles von derselben Art ist, kann die Last ein bisschen leichter machen." },
        { id: "b1-p12", type: "p", text: "Beim Schreiben fallen dir vielleicht auch Dinge ein, die du nicht aufschreiben willst. Du musst nicht alles aufschreiben. Diese Liste bekommt niemand zu sehen; sie soll dich nicht prüfen, sondern in deinem Kopf ein bisschen Platz schaffen." },
        { id: "b1-p13", type: "p", text: "Vielleicht fällt dir auch auf, dass manche Aufgaben kleiner werden, sobald sie aufgeschrieben sind. „Nachricht an den Vermieter“ wirkt im Kopf wie ein großes Gespräch und wird auf dem Papier zu einer Nachricht mit zwei Sätzen. Das passiert nicht bei jeder Aufgabe, aber wenn es passiert, tut es gut." },
        { id: "b1-p9", type: "p", text: "Als Lena an diesem Morgen aus der U-Bahn stieg, schrieb sie drei Minuten lang alles in ihre Handy-Notizen, was ihr einfiel. Es wurden vierzehn Zeilen. Nichts davon erledigte sie sofort. Aber als sie sah, dass sie ihre Freundin in der Mittagspause anrufen und das Rücksendepaket auf dem Heimweg zur Post bringen würde, wurde der Rest ein bisschen leiser." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "Drei Minuten Kopf leeren",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Stell dir einen Timer auf drei Minuten. Du kannst auch den Button unten verwenden.",
            "Schreib jede Aufgabe auf, die dir einfällt, kurz und ohne Reihenfolge. Unterscheide nicht zwischen groß und klein: „Nachricht wegen Miete“, „Hausarbeit“, „Zahnarzttermin“.",
            "Formuliere keine Sätze, die mit „Ich muss …“ anfangen; der Name der Aufgabe reicht.",
            "Hör auf, wenn der Timer abläuft. Die Liste darf unvollständig bleiben; was fehlt, kannst du später ergänzen.",
            "Mit der Liste musst du jetzt noch nichts machen. Es reicht zu wissen, dass sie da ist.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Wenn du aufschreibst, was dir im Kopf herumgeht, musst du es nicht sofort erledigen – du hörst nur auf, alles gleichzeitig mit dir herumzutragen.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Gib dem Tag eine Hauptaufgabe",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Dienstagmorgen, 10:00 Uhr. Lena sitzt in der Bibliothek am Tisch beim Fenster. Vor ihr liegt die Liste von gestern: vierzehn Zeilen.",
            "Zuerst öffnet sie die Datei mit der Hausarbeit. Ein paar Minuten später fällt ihr die Frist für das Praktikumsformular ein, und sie öffnet das Formular. Während sie das geforderte Dokument sucht, kommt ihr der Gedanke, nachzusehen, bis wann das Paket zurückgeschickt werden muss. Dann geht sie wieder zur Hausarbeit.",
            "Gegen Mittag sind sieben Tabs offen. Nichts davon ist fertig. Lena weiß, dass sie den ganzen Vormittag gearbeitet hat, aber sie hat nichts, was sie vorzeigen könnte.",
          ],
        },

        { id: "b2-h1", type: "h", text: "Eine Liste ist noch kein Plan" },
        { id: "b2-p1", type: "p", text: "Im ersten Kapitel hast du aufgeschrieben, was dir im Kopf herumgeht. Das nimmt Last von dir, sagt dir aber nicht, womit du heute anfangen sollst. Eine Liste ist eine Bestandsaufnahme. Wer auf vierzehn Zeilen gleichzeitig schaut, fängt leicht an zu glauben, dass jede dringender ist als die andere." },
        { id: "b2-p2", type: "p", text: "Genau so lief Lenas Vormittag. Jede Aufgabe war berechtigt, jeder Wechsel ergab Sinn. Aber bei jedem Hin und Her musste sie sich erst wieder erinnern, wo sie stehen geblieben war. Der Tag füllte sich mit halben Anfängen." },
        { id: "b2-p3", type: "p", text: "Was ich in diesem Kapitel vorschlage, ist einfach: Such dir für jeden Tag eine Hauptaufgabe aus. Es muss nicht die wichtigste Aufgabe deines Lebens sein. Der Maßstab ist: Wärst du am Abend erleichtert, wenn diese Aufgabe erledigt oder ein Stück vorangekommen ist? Wenn ja, ist sie die Hauptaufgabe für heute." },
        { id: "b2-p4", type: "p", text: "Die anderen Aufgaben verschwinden nicht; sie warten auf der Liste. Eine Hauptaufgabe zu wählen heißt nicht, auf die anderen zu verzichten, sondern zu entscheiden, dich später um sie zu kümmern." },

        { id: "b2-h5", type: "h", text: "Wenn die Wahl schwerfällt" },
        { id: "b2-p12", type: "p", text: "An manchen Morgen wirken zwei oder drei Aufgaben gleich dringend. An solchen Tagen können ein paar Fragen die Wahl erleichtern. Welche hat die nähere Frist? Welche hält andere Dinge auf, wenn sie nicht fertig wird? Bei welcher spürst du mehr Druck auf der Brust, wenn du an sie denkst?" },
        { id: "b2-p13", type: "p", text: "Nicht immer gibt es auf diese Fragen eine klare Antwort. Dann kann sogar eine Münze besser sein, als gar nicht zu wählen. Die „falsche“ Hauptaufgabe zu wählen ist oft weniger anstrengend, als den ganzen Tag zwischen drei Aufgaben hin- und herzuspringen; denn so kommt wenigstens eine voran." },
        { id: "b2-p14", type: "p", text: "Und noch etwas: Die Hauptaufgabe muss nicht jeden Tag groß sein. An einem Tag, an dem du müde bist, gerade eine Prüfung hinter dir hast oder krank bist, kann die Hauptaufgabe „Wäsche waschen“ sein. Die Hauptaufgabe richtet sich danach, was der Tag hergibt – nicht danach, was die Person schaffen würde, die du gern wärst." },

        { id: "b2-h2", type: "h", text: "Aus der Hauptaufgabe einen kleinen Schritt machen" },
        { id: "b2-p5", type: "p", text: "„Hausarbeit schreiben“ kann eine gute Hauptaufgabe sein, ist aber ein schlechter Anfang. Sie ist zu groß; du weißt nicht, wo du sie anpacken sollst. Was den Anfang erleichtert, ist der erste kleine Schritt: eine Handlung, so konkret, dass sie in ein paar Minuten erledigt ist." },
        { id: "b2-p6", type: "p", text: "Ein paar Beispiele: statt „Hausarbeit schreiben“ lieber „Die Datei öffnen und drei Überschriften notieren“. Statt „Praktikumsbewerbung“ lieber „Das fehlende Dokument für das Formular suchen und in den Ordner legen“. Statt „Mit dem Vermieter reden“ lieber „Den ersten Satz der Nachricht wegen der Miete schreiben“." },
        { id: "b2-p7", type: "p", text: "Der erste Schritt soll die Aufgabe nicht erledigen, sondern dich in sie hineinbringen. Manchmal machst du nach dem ersten Schritt weiter, manchmal nicht. Beides ist in Ordnung. Aber es ist ein Unterschied, ob du vor einer leeren Seite wartest oder zu einer Seite zurückkommst, auf der schon drei Überschriften stehen." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "Links ein großer Kasten mit einigen Zeilen darin; ein Pfeil führt zu vier kleinen Stufen, die nach rechts ansteigen. Auf der ersten und niedrigsten Stufe liegt ein orangefarbener Punkt.",
          caption: "Über eine große Aufgabe springt man nicht in einem Satz. Die erste Stufe sollte so niedrig sein, dass du sie heute nehmen kannst.",
        },

        { id: "b2-h3", type: "h", text: "Wann und wo?" },
        { id: "b2-p8", type: "p", text: "Wenn du den ersten Schritt gewählt hast, bleibt noch eine Frage: Wann und wo wirst du ihn machen? „Irgendwann heute“ rutscht oft ans Ende des Tages. „Nach dem Mittagessen, im oberen Stock der Bibliothek“ steht dagegen in deinem Kopf wie ein Termin." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "Pläne, die der Psychologe Peter Gollwitzer „Durchführungsintentionen“ (implementation intentions) nennt, legen im Voraus fest, wann, wo und wie man ein Ziel umsetzt: „Wenn Situation X eintritt, dann tue ich Y.“ In einer Metaanalyse, die 94 unabhängige Tests zusammenfasste, erreichten Teilnehmende, die solche Pläne machten, ihre Ziele im Durchschnitt deutlich häufiger als diejenigen, die sich nur ein Ziel gesetzt hatten.",
          limits: "Die Größe des Effekts schwankte zwischen den Studien, und ein Teil der Untersuchungen fand im Labor oder mit Studierenden statt. Ein durchschnittlicher Effekt zeigt nicht, dass der Plan bei allen und für jede Aufgabe funktioniert.",
          details: "Laut den Forschenden erleichtern solche Pläne den Start, weil die Entscheidung „Wann fange ich an?“ schon vorher getroffen ist und man im entscheidenden Moment einfach loslegen kann. In diesem Buch beruht der Bereich „Meine Startzeit festlegen“ in „Mein Tag“ auf dieser Idee.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Versuch, den Zeitpunkt nicht an eine Uhrzeit zu knüpfen, sondern an einen Moment, den es in deinem Tag sowieso gibt: „Nach der ersten Vorlesung“, „Wenn ich mir Kaffee eingeschenkt habe“, „Wenn ich nach Hause komme und die Tasche abstelle“. Uhrzeiten verschieben sich; solche Momente kommen an den meisten Tagen trotzdem.",
        },

        { id: "b2-h4", type: "h", text: "Nebenaufgaben und was auf morgen wartet" },
        { id: "b2-p9", type: "p", text: "Neben der Hauptaufgabe gibt es im Laufe des Tages auch kleinere Dinge zu erledigen. In „Mein Tag“ ist dafür nur Platz für zwei. Das wirkt vielleicht wie eine Einschränkung; eigentlich ist es ein Maß. Wenn du mehr als zwei Zeilen brauchst, ist der Tag vielleicht ohnehin schon voll, und es ist ganz natürlich, dass manches auf morgen wartet." },
        { id: "b2-p10", type: "p", text: "Eine Aufgabe, die auf morgen wartet, ist kein Scheitern, sondern eine Entscheidung. Dass sie auf der Liste bleibt, heißt, dass sie nicht vergessen ist." },
        { id: "b2-p11", type: "p", text: "An diesem Tag schloss Lena nach dem Mittagessen alle Tabs. Ihre Hauptaufgabe war die Hausarbeit; der erste Schritt: die Datei öffnen und drei Überschriften notieren. Sie setzte sich oben an einen freien Tisch. Die Überschriften dauerten zehn Minuten. Danach schrieb sie unter die erste Überschrift noch ein paar Absätze. Das Praktikumsformular und das Paket wurden zu den Nebenaufgaben für den nächsten Tag." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "Die Hauptaufgabe für heute",
          planner: "main",
          steps: [
            "Schau auf deine Liste und frag dich: Bei welcher Aufgabe wäre ich heute Abend erleichtert, wenn sie vorangekommen ist?",
            "Schreib diese Aufgabe als Hauptaufgabe für heute auf.",
            "Schreib darunter den ersten kleinen Schritt, mit dem du in ein paar Minuten anfangen kannst.",
            "Wenn du magst, ergänze, wann und wo du anfängst, zum Beispiel: „Nach dem Mittagessen, an meinem Schreibtisch“.",
            "Alles andere kann auf der Liste warten. Für heute reicht das.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "Eine einzige Hauptaufgabe für heute und ein kleiner erster Schritt dazu sind meistens leichter als der Versuch, mit einem Blick auf eine lange Liste anzufangen.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Pass deinen Plan an dein Leben an",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Donnerstag. Lenas Plan stand fest: nach dem Mittagessen in der Bibliothek den zweiten Teil der Hausarbeit schreiben.",
            "Aber das Gruppentreffen zog sich in die Länge. Beim Rausgehen fing es an zu regnen. Als sie zu Hause ankam, war es schon nach sechs; sie war nass, müde und ein bisschen gereizt.",
            "Der Satz in ihrem Kopf war ihr vertraut: „Heute ist eh schon alles im Eimer. Morgen fange ich richtig an.“",
          ],
        },

        { id: "b3-h1", type: "h", text: "Wenn der Plan nicht aufgeht" },
        { id: "b3-p1", type: "p", text: "Ein Plan vom Morgen ist eine Schätzung, wie der Tag laufen wird. Besprechungen ziehen sich, Busse kommen zu spät, die Energie ist früher aufgebraucht als gedacht. Dass ein Plan nicht aufgeht, ist kein Fehler der Person, die ihn gemacht hat; so sind Schätzungen eben." },
        { id: "b3-p2", type: "p", text: "Das Problem ist oft nicht der geplatzte Plan, sondern das „Alles oder nichts“-Denken, das danach kommt. Wenn sich der Plan nicht genau so umsetzen lässt, fühlt es sich an, als ginge gar nichts. Dabei gibt es an den meisten Tagen drei Möglichkeiten." },
        { id: "b3-p3", type: "p", text: "Erstens: die Zeit verschieben. „Am Nachmittag hat es nicht geklappt, also eine halbe Stunde nach dem Abendessen.“ Zweitens: den Schritt verkleinern. „Den zweiten Teil schaffe ich nicht, aber ich kann meine Notizen einmal durchlesen.“ Drittens: bewusst verschieben. „Heute mache ich es nicht; morgen früh ist es das Erste.“ Alle drei sind Entscheidungen. Ein verlorener Tag ist ein Tag, an dem keine Entscheidung fällt." },

        { id: "b3-h2", type: "h", text: "Eine kleinere Variante für schwere Tage" },
        { id: "b3-p4", type: "p", text: "An einem guten Tag ist der erste Schritt leicht. Auf die Probe gestellt wird ein Plan an den schweren Tagen. Deshalb kann es helfen, vorher eine „kleinere Variante“ festzulegen: eine Notlösung, so klein, dass du sie auch an einem schlechten Tag schaffst." },
        { id: "b3-p5", type: "p", text: "Bei der Hausarbeit kann das heißen, die Datei zu öffnen und einen einzigen Satz zu schreiben. Beim Spazierengehen: vor die Tür gehen und fünf Minuten um den Block laufen. Beim Lesen: eine Seite. Die kleine Variante ist nicht dafür da, dass die Aufgabe als erledigt gilt, sondern dafür, dass der Faden nicht reißt." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "Ein gestrichelter Weg verläuft von links nach rechts und biegt in der Mitte um ein Hindernis herum. Darunter sieben kleine Quadrate; die meisten sind gefüllt, eines ist leer, neben dem letzten ein orangefarbener Punkt.",
          caption: "Ein Plan kann um ein Hindernis herumführen. Eine Lücke an einem von sieben Tagen heißt nicht, dass der Weg zu Ende ist.",
        },

        { id: "b3-h3", type: "h", text: "Einen Tag auslassen" },
        { id: "b3-p6", type: "p", text: "Wer eine neue Gewohnheit ausprobiert und einen Tag auslässt, hat oft das Gefühl, wieder ganz von vorn anfangen zu müssen. Serienzähler verstärken dieses Gefühl noch: Eine Kette von dreißig Tagen steht an einem einzigen Tag wieder auf null." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "In einer Studie in London wählten 96 Freiwillige ein Ess-, Trink- oder Bewegungsverhalten, das sie jeden Tag in derselben Situation ausführen wollten, und schätzten 12 Wochen lang täglich selbst ein, wie automatisch dieses Verhalten geworden war. Eine einzelne verpasste Gelegenheit beeinträchtigte die Gewohnheitsbildung nicht nennenswert. Bis das Verhalten nahezu automatisch ablief, dauerte es von Person zu Person sehr unterschiedlich lange: zwischen 18 und 254 Tagen.",
          limits: "Eine kleine Gruppe von Freiwilligen und einfache Alltagshandlungen. Die Automatik wurde über die Selbsteinschätzung der Teilnehmenden gemessen, und die Daten einiger Teilnehmender passten nicht gut zum Modell. Bei komplexeren Verhaltensweisen können die Ergebnisse anders ausfallen.",
          details: "Der Median lag in der Studie bei 66 Tagen; das ist aber weder ein Durchschnitt noch ein Ziel. Der Befund legt nahe, dass feste Zeiträume wie „In 21 Tagen zur Gewohnheit“ nicht für alle passen und dass ein gelegentlich verpasster Tag den Prozess nicht auf null setzt.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "Wenn du eine Gewohnheit ausprobierst, mach zuerst einen kurzen Versuch über sieben Tage. Es geht nicht darum, in sieben Tagen eine Gewohnheit aufzubauen, sondern herauszufinden, ob die Zeit, der Ort und der Schritt, die du gewählt hast, zu dir passen. Den Plan nach den sieben Tagen zu ändern, gehört zum Versuch dazu.",
        },

        { id: "b3-h5", type: "h", text: "Wenn der Plan nicht zu dir passt" },
        { id: "b3-p10", type: "p", text: "Manchmal liegt es nicht an einem einzelnen schlechten Tag. Wenn derselbe Plan mehrere Tage hintereinander nicht klappt, kann das ein Zeichen sein, dass nicht der Plan sich nach dir richtet, sondern du dich nach dem Plan. Wer sich vornimmt, um sieben Uhr morgens laufen zu gehen, aber jeden Morgen den Wecker ausmacht, für den lautet die eigentliche Frage vielleicht nicht „Warum schaffe ich das nicht?“, sondern „Passt diese Uhrzeit wirklich zu mir?“" },
        { id: "b3-p11", type: "p", text: "Wenn du den Plan änderst, kannst du auf drei Dinge schauen: die Zeit, den Ort und die Größe des Schritts. Oft reicht es, eins davon zu ändern. Abends statt morgens, Bibliothek statt Zuhause, zehn Minuten statt einer halben Stunde. Das Ziel kann gleich bleiben; nur der Weg dorthin ändert sich." },
        { id: "b3-p12", type: "p", text: "Bei solchen Änderungen kann es helfen, dich selbst wie jemanden zu sehen, der ein Experiment durchführt. Experimente liefern nicht immer das erwartete Ergebnis; das heißt nicht, dass die Person, die sie durchführt, gescheitert ist, sondern nur, was sie beim nächsten Versuch ändern kann." },

        { id: "b3-h4", type: "h", text: "Zwei Fragen am Abend" },
        { id: "b3-p7", type: "p", text: "Statt am Ende des Tages zu zählen, wie viel vom Plan geklappt hat, versuch es mit zwei Fragen: Was hat heute geholfen? Was kann ich mir für morgen leichter machen? Die erste lässt dich bemerken, was funktioniert. Die zweite passt den Plan für morgen ein wenig an das an, was du heute erlebt hast." },
        { id: "b3-p8", type: "p", text: "Die Antworten dürfen klein sein: „Das Handy in ein anderes Zimmer zu legen hat geholfen.“ „Morgen packe ich meine Tasche schon am Abend vorher.“ So passen sich Pläne nach und nach dem Leben an, mit kleinen Korrekturen von Tag zu Tag." },
        { id: "b3-p9", type: "p", text: "An diesem Donnerstagabend öffnete Lena die Datei mit der Hausarbeit und schrieb einen einzigen Satz für den zweiten Teil. Dann ging sie schlafen. Als sie die Datei am nächsten Morgen öffnete, wartete statt einer leeren Seite ein Satz auf sie." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "Ein kleiner Versuch über sieben Tage",
          planner: "habit",
          steps: [
            "Such dir eine einzige Gewohnheit aus, die du ausprobieren möchtest.",
            "Schreib den kleinsten machbaren Anfang auf: so klein, dass du ihn auch an einem schlechten Tag schaffst.",
            "Knüpf ihn an einen Moment, den es in deinem Tag sowieso gibt, und leg fest, wo du ihn machst.",
            "Ergänze eine kleinere Variante für schwere Tage.",
            "Markiere sieben Tage lang jeden Abend nur: gemacht, kleinere Variante gemacht oder nicht gemacht. Schau dir danach deinen Plan noch einmal an.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "Wenn ein Plan nicht aufgeht, kannst du ihn meistens zeitlich verschieben oder den Schritt verkleinern, statt ihn aufzugeben – und ein verpasster Tag heißt nicht, dass der Weg zu Ende ist.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Zum Schluss",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "In diesem Buch ging es um drei kleine Ideen: das, was dir im Kopf herumgeht, irgendwo ablegen; für heute eine einzige Hauptaufgabe und ihren ersten Schritt wählen; und den Plan ändern dürfen, wenn sich der Tag ändert." },
        { id: "k2", type: "p", text: "Nichts davon wird jeden Tag leicht machen. An manchen Tagen bleibt die Liste lang, die Hauptaufgabe kommt nicht voran, der Versuch gerät ins Stocken. Das heißt nicht, dass die Methode oder du versagt hast. Am nächsten Tag kannst du wieder eine Hauptaufgabe wählen." },
        { id: "k3", type: "p", text: "Der Planer und der Bereich „Gewohnheit“ bleiben auch nach dem Lesen hier. An manchen Tagen kannst du sie öffnen und nur die Hauptaufgabe für heute eintragen, an anderen gar nicht hineinschauen. Deine Einträge bleiben nur auf diesem Gerät; denk daran, ab und zu ein Backup zu machen." },
        { id: "k4", type: "p", text: "Kleine Schritte lösen nicht alles. Aber an den meisten Tagen reichen sie, um anzufangen." },
      ],
    },
  ],
};
