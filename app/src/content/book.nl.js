/*
 * Boekinhoud (Nederlands): "Kleine stappen, heldere dagen"
 * Vertaling van book.tr.js — zelfde hoofdstuk- en blok-id's; de bronnenlijst staat alleen in book.tr.js.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.nl = {
  lang: "nl",
  title: "Kleine stappen, heldere dagen",
  subtitle: "Een kort boek en een rustige dagplanner",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Om te beginnen",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "Dit korte boek is geschreven voor iemand die probeert de dag door te komen. Voor iemand die studie, werk, huishouden en de eindeloze meldingen op de telefoon tegelijk draagt, en zich 's avonds afvraagt: “Wat heb ik vandaag eigenlijk gedaan?”" },
        { id: "g2", type: "p", text: "Je vindt hier geen groot systeem. Geen agenda's met kleurcodes, geen ochtendroutines van twintig stappen en geen belofte dat alles van de ene op de andere dag verandert. Er zijn drie kleine ideeën: wat je in je hoofd hebt ergens neerleggen, één hoofdtaak voor vandaag kiezen, en je plan aanpassen als de dag anders loopt." },
        { id: "g3", type: "p", text: "Elk hoofdstuk is kort genoeg om in de trein of de bus te lezen. Aan het eind van elk hoofdstuk staat een oefening van een paar minuten. Die kun je op papier doen, of in de planner in deze app." },
        { id: "g4", type: "p", text: "Hier en daar noem ik onderzoek. Lees dat niet als “de wetenschap heeft bewezen”, maar als “bij sommige mensen, onder bepaalde omstandigheden, zag men dit”. Wat het onderzoek zegt en wat ik zelf voorstel, zie je in aparte kaders. Als je weet wat wat is, kun je makkelijker beslissen wat je meeneemt in je eigen leven." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "Je hoeft niet alles te onthouden",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "Het is 8.10 uur. Sanne staat in de metro, vlak bij de deur. Met één hand houdt ze zich vast aan de lus, met de andere scrolt ze door haar mail.",
            "Haar gedachten komen niet netjes op volgorde. De opdracht die vrijdag ingeleverd moet worden. Het berichtje aan de verhuurder over de huur. Het retourpakketje dat nog naar het afhaalpunt moet. Haar moeder, die volgende week jarig is. Het half ingevulde formulier van de stage-aanvraag. En gisteravond had ze tegen een vriendin gezegd: “Ik bel je morgen.” Wanneer zou ze bellen?",
            "Als de metro het station nadert, bekruipt haar een bekend gevoel: ik vergeet iets, maar wat? De dag is nog niet begonnen en ze is al moe.",
          ],
        },

        { id: "b1-h1", type: "h", text: "Je hoofd is een goede herinnering, maar een slechte opslag" },
        { id: "b1-p1", type: "p", text: "Sannes probleem is geen luiheid of slordigheid. Het probleem is dat al haar taken tegelijk op één plek staan: in haar hoofd." },
        { id: "b1-p2", type: "p", text: "Een onafgemaakte taak meldt zich af en toe opnieuw, zolang je hem nergens hebt opgeschreven. Tijdens een college schiet het retourpakketje je te binnen, tijdens het eten de opdracht. Soms zijn die herinneringen nuttig. Maar ze kiezen hun moment en volgorde niet. Een belangrijke taak roept even hard als een onbelangrijke." },
        { id: "b1-p3", type: "p", text: "Het resultaat: je hebt twintig halve gedachten en kunt er niet één helemaal afdenken. Dat kan een van de redenen zijn waarom je je de hele dag druk voelt en 's avonds het gevoel hebt dat je niets hebt gedaan." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "In een reeks experimenten dwaalden de gedachten van deelnemers die aan een onafgemaakt doel werden herinnerd, tijdens een leestaak die er niets mee te maken had, vaker af naar dat doel. Toen ze voor datzelfde doel een concreet plan mochten maken, verdween dit effect.",
          limits: "De experimenten werden in een laboratorium gedaan, meestal met universiteitsstudenten. In het dagelijks leven geeft het misschien niet bij iedereen hetzelfde resultaat.",
          details: "Volgens de onderzoekers maakte niet het onthouden van de taak het verschil, maar het maken van een concreet plan ervoor. In dit boek is opschrijven de eerste stap; plannen is het onderwerp van het tweede hoofdstuk.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "Waarom opschrijven helpt" },
        { id: "b1-p4", type: "p", text: "Opschrijven wat er in je hoofd zit, is geen belofte dat je al die dingen gaat doen. Het lijkt meer op ze ergens parkeren. Als je auto in de parkeergarage staat, hoef je er niet steeds aan te denken; het is genoeg dat je weet waar hij staat." },
        { id: "b1-p5", type: "p", text: "Een lijst op papier doet drie concrete dingen. Ten eerste kun je taken met elkaar vergelijken. In je hoofd lijken ze allemaal even groot; op papier zie je dat sommige twee minuten kosten en andere twee weken. Ten tweede neemt de angst om iets te vergeten af, omdat het papier het onthouden nu voor je doet. Ten derde wordt de volgende stap makkelijker: beslissen wat je vandaag kiest." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "Links korte lijntjes en lussen van verschillende grootte die door elkaar lopen; vanuit het midden wijst een pijl naar een vel papier rechts met nette regels. Op het papier staan een paar regels, en naast één regel staat een klein vinkje.",
          caption: "In je hoofd loopt alles door elkaar. Op papier komen dezelfde taken op een rij en kun je ze vergelijken.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "In een onderzoek in een slaaplaboratorium vielen jongvolwassenen die voor het slapengaan vijf minuten opschreven wat ze de komende dagen moesten doen, gemiddeld sneller in slaap dan degenen die opschreven wat ze de afgelopen dagen hadden afgerond.",
          limits: "Eén nacht, een kleine groep van 57 mensen zonder slaapproblemen. Het laat niet zien dat opschrijven voor iedereen goed is voor de slaap.",
          details: "Wie de takenlijst gedetailleerder opschreef, sliep ook sneller in. Lees deze bevinding als een aanwijzing dat het verplaatsen van de lijst van je hoofd naar papier rust kan geven, niet als een vaststaande conclusie.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "Je hoeft niet je hele leven te organiseren" },
        { id: "b1-p6", type: "p", text: "Op dit punt is de eerste ingeving vaak een grote opruimactie: een nieuwe app downloaden, alles in categorieën indelen, kleuren, labels, prioriteitsniveaus. Een week later is het systeem zelf weer een taak die onderhoud nodig heeft." },
        { id: "b1-p7", type: "p", text: "Dat hoeft niet. Het enige wat je in dit hoofdstuk doet, is een paar minuten lang naar buiten halen wat er in je hoofd zit. Geen indeling, geen volgorde, geen plan. Daar komen we in het tweede hoofdstuk op, en ook dan kiezen we één taak, geen twintig." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Houd de lijst op één plek. Schrijf je de ene dag in de notitie-app op je telefoon, de volgende dag op een papiertje en de dag daarna in een concept-bericht, dan probeert je hoofd voortaan te onthouden waar je lijsten liggen. Welke plek het is, maakt niet uit; dat het steeds dezelfde plek is, wel.",
        },

        { id: "b1-p8", type: "p", text: "Het kan ook helpen om dit te weten: je lijst zal er rommelig uitzien. “Mama bellen” staat gewoon onder “Nadenken over wat ik na mijn afstuderen wil”. Dat is normaal. De lijst is er niet om netjes te zijn, maar om zichtbaar te maken wat je met je meedraagt." },
        { id: "b1-h4", type: "h", text: "En als de lijst lang wordt?" },
        { id: "b1-p10", type: "p", text: "Veel mensen die voor het eerst alles opschrijven, schrikken even als ze naar de lijst kijken. Vijftien, twintig regels. “Heb ik zoveel te doen?” Maar al die dingen waren er al; alleen kun je ze nu tellen." },
        { id: "b1-p11", type: "p", text: "Een lange lijst betekent niet dat je alles vandaag moet doen. Sommige regels zijn een kwestie van één berichtje, andere een onderwerp dat maanden duurt, en sommige zijn eigenlijk geen taak maar een zorg: “Zal ik wel een stage vinden?” Om ze te scheiden hoef je nu nog niets te doen. Alleen al zien dat ze niet allemaal van dezelfde soort zijn, kan de last een beetje lichter maken." },
        { id: "b1-p12", type: "p", text: "Er kunnen ook dingen bij je opkomen die je liever niet opschrijft. Je hoeft niet alles op te schrijven. Niemand krijgt deze lijst te zien; hij is er niet om je te testen, maar om wat ruimte in je hoofd te maken." },
        { id: "b1-p13", type: "p", text: "Misschien merk je ook dit: sommige taken worden kleiner zodra ze op papier staan. “Bericht aan de verhuurder” voelt in je hoofd als een groot gesprek, maar op papier wordt het een bericht van twee zinnen. Dat gebeurt niet bij elke taak, maar als het gebeurt, is het fijn." },
        { id: "b1-p9", type: "p", text: "Toen Sanne die ochtend uit de metro stapte, schreef ze drie minuten lang alles wat bij haar opkwam in de notities op haar telefoon. Het werden veertien regels. Ze deed er op dat moment niets mee. Maar toen ze zag dat ze haar vriendin in de lunchpauze zou bellen en het retourpakketje 's avonds op weg naar huis bij het afhaalpunt zou afgeven, werd de rest een beetje stiller." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "Drie minuten je hoofd leegmaken",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Zet een timer op drie minuten. Je kunt ook de knop hieronder gebruiken.",
            "Schrijf elke taak die bij je opkomt kort op, in willekeurige volgorde. Maak geen onderscheid tussen groot en klein: “Bericht over de huur”, “Opdracht”, “Afspraak tandarts”.",
            "Begin geen zinnen met “Ik moet”; de naam van de taak is genoeg.",
            "Stop als de timer afgaat. De lijst mag onvolledig zijn; wat ontbreekt, kun je later nog toevoegen.",
            "Je hoeft voorlopig niets met de lijst te doen. Weet gewoon dat hij er is.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Als je de dingen in je hoofd ergens opschrijft, hoef je ze niet meteen te doen; je hoeft ze alleen niet langer allemaal tegelijk mee te dragen.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Geef vandaag één hoofdtaak",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Dinsdagochtend, 10.00 uur. Sanne zit in de bibliotheek, aan het tafeltje bij het raam. Voor haar ligt de lijst van gisteren: veertien regels.",
            "Eerst opent ze het bestand van haar opdracht. Na een paar minuten schiet de deadline van het stageformulier haar te binnen, en ze opent het formulier. Terwijl ze zoekt naar het document dat erbij moet, bedenkt ze dat ze moet kijken hoelang ze nog heeft om het pakketje te retourneren. Daarna gaat ze weer terug naar de opdracht.",
            "Tegen de middag staan er zeven tabbladen open op haar scherm. Niets is af. Sanne weet dat ze de hele ochtend heeft gewerkt, maar ze heeft niets om te laten zien.",
          ],
        },

        { id: "b2-h1", type: "h", text: "Een lijst is geen plan" },
        { id: "b2-p1", type: "p", text: "In het eerste hoofdstuk heb je opgeschreven wat er in je hoofd zat. Dat maakt de last lichter, maar het vertelt je niet waarmee je vandaag begint. Een lijst is een inventaris. Wie naar veertien regels tegelijk kijkt, kan gaan denken dat elke regel dringender is dan de andere." },
        { id: "b2-p2", type: "p", text: "Zo verliep Sannes ochtend ook. Elke taak was terecht, elke overstap logisch. Maar elke keer dat ze wisselde, moest ze opnieuw bedenken waar ze gebleven was. De dag raakte gevuld met half begonnen dingen." },
        { id: "b2-p3", type: "p", text: "Wat ik in dit hoofdstuk voorstel, is eenvoudig: kies voor elke dag één hoofdtaak. Het hoeft niet de belangrijkste taak van je leven te zijn. De maatstaf is: als deze taak vanavond af is of verder is gekomen, ben je dan opgelucht? Is het antwoord ja, dan is dat de hoofdtaak van vandaag." },
        { id: "b2-p4", type: "p", text: "De andere taken verdwijnen niet; ze wachten op de lijst. Een hoofdtaak kiezen betekent niet dat je de rest opgeeft, maar dat je de vraag wanneer je ernaar kijkt even uitstelt." },

        { id: "b2-h5", type: "h", text: "Als kiezen moeilijk is" },
        { id: "b2-p12", type: "p", text: "Sommige ochtenden lijken twee of drie taken even dringend. Op zulke dagen zijn er een paar vragen die het kiezen makkelijker kunnen maken. Welke heeft de dichtstbijzijnde deadline? Welke houdt ook andere dingen op als hij niet af komt? Bij welke voel je de meeste druk op je borst als je eraan denkt?" },
        { id: "b2-p13", type: "p", text: "Die vragen hebben niet altijd een duidelijk antwoord. Dan kan zelfs kop of munt beter zijn dan helemaal niet kiezen. De ‘verkeerde’ hoofdtaak kiezen is vaak minder vermoeiend dan de hele dag heen en weer springen tussen drie taken; dan komt er tenminste één verder." },
        { id: "b2-p14", type: "p", text: "En nog iets: de hoofdtaak hoeft niet elke dag groot te zijn. Op een dag dat je moe bent, net een tentamen achter de rug hebt of ziek bent, kan de hoofdtaak “De was doen” zijn. Je kiest de hoofdtaak naar wat de dag aankan, niet naar wat de persoon die je wilt zijn aankan." },

        { id: "b2-h2", type: "h", text: "Van hoofdtaak naar een kleine stap" },
        { id: "b2-p5", type: "p", text: "“De opdracht schrijven” kan een goede hoofdtaak zijn, maar het is een slecht begin. Het is te groot; je weet niet waar je moet beginnen. Wat het beginnen makkelijker maakt, is de eerste kleine stap van de hoofdtaak: een handeling die zo concreet is dat je hem in een paar minuten kunt doen." },
        { id: "b2-p6", type: "p", text: "Een paar voorbeelden: niet “De opdracht schrijven”, maar “Het bestand openen en drie kopjes typen”. Niet “Stage-aanvraag”, maar “Het ontbrekende document voor het formulier opzoeken en in de map zetten”. Niet “Met de verhuurder praten”, maar “De eerste zin van het bericht over de huur schrijven”." },
        { id: "b2-p7", type: "p", text: "Het doel van de eerste stap is niet de taak afmaken, maar erin komen. Soms ga je na die eerste stap door, soms niet. Allebei is prima. Maar er is verschil tussen wachten voor een lege pagina en terugkomen bij een pagina waar al drie kopjes op staan." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "Links een grote doos met een paar regels erin; een pijl wijst naar vier kleine traptreden die naar rechts omhooglopen. Op de eerste en laagste trede staat een oranje stip.",
          caption: "Een grote taak neem je niet in één sprong. De eerste trede moet laag genoeg zijn om vandaag te nemen.",
        },

        { id: "b2-h3", type: "h", text: "Wanneer en waar?" },
        { id: "b2-p8", type: "p", text: "Als je de eerste stap hebt gekozen, blijft er nog één vraag over: wanneer en waar ga je hem doen? “Vandaag ergens” schuift vaak op naar het eind van de dag. “Na de lunch, op de bovenste verdieping van de bibliotheek” staat in je hoofd als een afspraak." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "Plannen die psycholoog Peter Gollwitzer ‘implementatie-intenties’ noemde, leggen van tevoren vast wanneer, waar en hoe je een doel uitvoert: “Als situatie X zich voordoet, dan doe ik Y.” In een meta-analyse waarin 94 onafhankelijke tests werden samengebracht, bereikten deelnemers die zo’n plan maakten hun doel gemiddeld duidelijk vaker dan deelnemers die alleen een doel stelden.",
          limits: "De grootte van het effect verschilde tussen de onderzoeken, en een deel van het onderzoek werd in het laboratorium of met studenten gedaan. Een gemiddeld effect betekent niet dat het plan voor iedereen en bij elke taak werkt.",
          details: "Volgens de onderzoekers maken zulke plannen het beginnen makkelijker als het moment daar is, omdat de beslissing “wanneer begin ik?” al van tevoren is genomen. In dit boek is het onderdeel “Bepalen wanneer ik begin” in Mijn dag op dit idee gebaseerd.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Probeer de tijd niet als klokuur vast te leggen, maar te koppelen aan een moment dat al in je dag zit: “Na het eerste college”, “Als ik koffie heb gezet”, “Als ik thuiskom en mijn tas neerzet”. Klokuren schuiven op; zulke momenten komen de meeste dagen gewoon weer langs.",
        },

        { id: "b2-h4", type: "h", text: "Extra taken en wat naar morgen gaat" },
        { id: "b2-p9", type: "p", text: "Naast je hoofdtaak zijn er ook kleine dingen die die dag moeten gebeuren. In Mijn dag is daar maar plek voor twee. Dat lijkt misschien een beperking, maar het is eigenlijk een maatstaf. Heb je meer dan twee regels nodig, dan is vandaag waarschijnlijk al een volle dag en is het logisch dat sommige dingen naar morgen gaan." },
        { id: "b2-p10", type: "p", text: "Een taak die naar morgen gaat, is geen mislukking maar een beslissing. Dat hij op de lijst blijft staan, betekent dat hij niet vergeten is." },
        { id: "b2-p11", type: "p", text: "Die dag sloot Sanne na de lunch alle tabbladen. Haar hoofdtaak was de opdracht; haar eerste stap was het bestand openen en drie kopjes typen. Ze ging aan een leeg tafeltje op de bovenste verdieping zitten. De kopjes kostten tien minuten. Daarna schreef ze onder het eerste kopje nog een paar alinea's. Het stageformulier en het pakketje werden de extra taken voor de volgende dag." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "De hoofdtaak van vandaag",
          planner: "main",
          steps: [
            "Kijk naar je lijst en vraag jezelf: van welke taak word ik vanavond opgelucht als hij verder is gekomen?",
            "Schrijf die taak op als de hoofdtaak van vandaag.",
            "Schrijf eronder de eerste kleine stap waarmee je in een paar minuten kunt beginnen.",
            "Als je wilt, zet je er ook bij wanneer en waar je begint, bijvoorbeeld: “Na de lunch, aan mijn bureau”.",
            "De rest kan op de lijst wachten. Voor vandaag is dit genoeg.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "Eén hoofdtaak voor vandaag met een kleine eerste stap is vaak makkelijker dan proberen te beginnen terwijl je naar een lange lijst kijkt.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Laat je plan passen bij je leven",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Donderdag. Sannes plan stond vast: na de lunch in de bibliotheek aan het tweede deel van haar opdracht werken.",
            "Maar het groepsoverleg liep uit. Toen ze naar buiten kwam, begon het te regenen. Toen ze thuiskwam, was het al na zessen; ze was nat, moe en ook een beetje geïrriteerd.",
            "De gedachte die door haar hoofd ging, kende ze wel: “Vandaag is toch al mislukt. Morgen begin ik opnieuw, en dan goed.”",
          ],
        },

        { id: "b3-h1", type: "h", text: "Als je plan in de war raakt" },
        { id: "b3-p1", type: "p", text: "Een plan dat je 's ochtends maakt, is een inschatting van hoe de dag zal lopen. Overleggen lopen uit, bussen hebben vertraging, je energie is eerder op dan verwacht. Dat een plan niet uitkomt, is geen fout van degene die het maakte; zo werken inschattingen nu eenmaal." },
        { id: "b3-p2", type: "p", text: "Het probleem is vaak niet het plan dat in de war raakt, maar de alles-of-niets-gedachte die daarop volgt. Als het plan niet precies zo kan, voelt het alsof het helemaal niet kan. Terwijl je op de meeste dagen drie mogelijkheden hebt." },
        { id: "b3-p3", type: "p", text: "De eerste: de tijd verschuiven. “Vanmiddag lukte het niet, dan na het eten een halfuur.” De tweede: de stap kleiner maken. “Het tweede deel schrijven lukt niet, maar mijn aantekeningen één keer doorlezen wel.” De derde: bewust uitstellen. “Vandaag doe ik het niet; morgenochtend is dit het eerste wat ik doe.” Alle drie zijn een beslissing. Een verloren dag is een dag waarop je niets beslist." },

        { id: "b3-h2", type: "h", text: "Een kleinere optie voor moeilijke dagen" },
        { id: "b3-p4", type: "p", text: "Op een dag die goed loopt, is de eerste stap makkelijk. Een plan wordt pas echt op de proef gesteld op moeilijke dagen. Daarom kan het helpen om van tevoren een ‘kleinere optie’ te bedenken: een reserve die zo klein is dat je hem zelfs op een slechte dag kunt doen." },
        { id: "b3-p5", type: "p", text: "Voor een opdracht kan dat zijn: het bestand openen en één zin schrijven. Voor wandelen: naar buiten gaan en vijf minuten een rondje om het huis lopen. Voor lezen: één bladzijde. De kleine optie is er niet om de taak af te vinken, maar om het contact met de taak niet te verliezen." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "Een gestippeld pad dat van links naar rechts loopt, buigt om een obstakel in het midden heen en loopt dan verder. Onderaan staan zeven kleine vierkantjes; de meeste zijn gevuld, één is leeg, en naast het laatste staat een oranje stip.",
          caption: "Een plan kan om een obstakel heen. Eén lege dag op de zeven betekent niet dat de weg ophoudt.",
        },

        { id: "b3-h3", type: "h", text: "Een dag overslaan" },
        { id: "b3-p6", type: "p", text: "Als je een nieuwe gewoonte probeert, voelt één dag overslaan voor veel mensen alsof ze helemaal opnieuw moeten beginnen. Reeksentellers voeden dat gevoel: een ketting van dertig dagen staat in één dag weer op nul." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "In een onderzoek in Londen kozen 96 vrijwilligers een eet-, drink- of bewegingsgedrag dat ze elke dag in dezelfde situatie zouden doen, en gaven ze 12 weken lang elke dag zelf aan hoe automatisch dat gedrag was geworden. Eén gemiste gelegenheid verstoorde het ontstaan van de gewoonte niet duidelijk. Hoelang het duurde voordat het gedrag bijna automatisch was, verschilde sterk van persoon tot persoon: tussen de 18 en 254 dagen.",
          limits: "Een kleine groep vrijwilligers en eenvoudige dagelijkse handelingen. Automatisme werd gemeten met de eigen beoordeling van de deelnemers, en de gegevens van een deel van de deelnemers pasten niet goed in het model. Bij ingewikkelder gedrag kunnen de resultaten anders zijn.",
          details: "In het onderzoek was de mediaan 66 dagen; maar dat is geen gemiddelde, en ook geen streefdoel. De bevinding doet vermoeden dat vaste termijnen zoals “in 21 dagen een gewoonte” niet voor iedereen gelden, en dat af en toe een dag missen het proces niet op nul zet.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "Als je een gewoonte uitprobeert, begin dan met een korte proef van zeven dagen. Het doel is niet om in zeven dagen een gewoonte op te bouwen, maar om te zien of de tijd, de plek en de stap die je hebt gekozen bij je passen. Na die zeven dagen je plan aanpassen hoort bij het experiment.",
        },

        { id: "b3-h5", type: "h", text: "Als het plan niet bij je past" },
        { id: "b3-p10", type: "p", text: "Soms is het probleem niet één slechte dag. Lukt hetzelfde plan een paar dagen achter elkaar niet, dan kan dat betekenen dat niet het plan zich aan jou aanpast, maar jij je aan het plan probeert aan te passen. Voor iemand die om zeven uur 's ochtends wil hardlopen maar elke ochtend de wekker uitzet, is de echte vraag misschien niet “Waarom lukt het me niet?” maar “Past dit tijdstip eigenlijk wel bij mij?”" },
        { id: "b3-p11", type: "p", text: "Als je je plan aanpast, kun je naar drie dingen kijken: de tijd, de plek en de grootte van de stap. Vaak is het genoeg om er één te veranderen. 's Avonds in plaats van 's ochtends, de bibliotheek in plaats van thuis, tien minuten in plaats van een halfuur. Het doel kan hetzelfde blijven; alleen de weg ernaartoe verandert." },
        { id: "b3-p12", type: "p", text: "Bij het aanpassen kan het helpen om naar jezelf te kijken als iemand die een experiment uitvoert. Experimenten geven niet altijd het verwachte resultaat; dat betekent niet dat degene die ze uitvoert gefaald heeft, alleen dat duidelijk wordt wat je bij de volgende poging verandert." },

        { id: "b3-h4", type: "h", text: "Twee vragen voor de avond" },
        { id: "b3-p7", type: "p", text: "Probeer aan het eind van de dag niet te tellen hoeveel van je plan is gelukt, maar stel jezelf twee vragen: wat werkte er vandaag? Wat kan ik morgen makkelijker maken? De eerste helpt je zien wat werkt. De tweede stelt het plan voor morgen een beetje bij op basis van wat je vandaag hebt meegemaakt." },
        { id: "b3-p8", type: "p", text: "De antwoorden mogen klein zijn: “Mijn telefoon in een andere kamer leggen hielp.” “Morgen pak ik mijn tas de avond ervoor al in.” Zo gaan plannen bij je leven passen: met kleine aanpassingen, van dag tot dag." },
        { id: "b3-p9", type: "p", text: "Die donderdagavond opende Sanne het bestand van haar opdracht en schreef één zin voor het tweede deel. Daarna ging ze slapen. Toen ze het bestand de volgende ochtend opende, wachtte er geen lege pagina op haar, maar een zin." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "Een kleine proef van zeven dagen",
          planner: "habit",
          steps: [
            "Kies één gewoonte die je wilt uitproberen.",
            "Schrijf het kleinste begin op dat haalbaar is: zo klein dat je het zelfs op een slechte dag kunt doen.",
            "Koppel het aan een moment dat al in je dag zit, en bepaal waar je het doet.",
            "Voeg een kleinere optie toe voor moeilijke dagen.",
            "Vink zeven dagen lang elke avond alleen dit aan: gedaan, een kleinere versie gedaan, of niet gedaan. Kijk daarna opnieuw naar je plan.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "Als je plan in de war raakt, kun je het vaak verschuiven of de stap kleiner maken in plaats van het op te geven; en een dag missen betekent niet dat de weg ophoudt.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Tot slot",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "Dit boek ging over drie kleine ideeën: wat je in je hoofd hebt ergens neerleggen, één hoofdtaak voor vandaag en de eerste stap daarvan kiezen, en je plan aanpassen als de dag anders loopt." },
        { id: "k2", type: "p", text: "Geen van deze ideeën maakt elke dag makkelijk. Op sommige dagen blijft de lijst lang, komt de hoofdtaak niet verder of hapert je proef. Dat betekent niet dat de aanpak, of jij, gefaald heeft. De volgende dag kun je gewoon weer een hoofdtaak kiezen." },
        { id: "k3", type: "p", text: "De planner en het onderdeel Gewoonte blijven er ook als je het boek uit hebt. Je kunt ze openen wanneer je wilt en alleen de hoofdtaak van vandaag opschrijven, of ze een dag helemaal niet openen. Je gegevens staan alleen op dit apparaat; vergeet niet af en toe een back-up te maken." },
        { id: "k4", type: "p", text: "Kleine stappen lossen niet alles op. Maar op de meeste dagen kunnen ze genoeg zijn om te beginnen." },
      ],
    },
  ],
};
