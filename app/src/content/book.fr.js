/*
 * Contenu du livre (français) : « Petits pas, journées plus claires »
 * Traduit de book.tr.js ; mêmes chapitres et identifiants de blocs. La bibliographie reste dans book.tr.js.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.fr = {
  lang: "fr",
  title: "Petits pas, journées plus claires",
  subtitle: "Une courte lecture et un planificateur quotidien tout en douceur",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Pour commencer",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "Ce petit livre a été écrit pour celles et ceux qui essaient de sauver leur journée. Pour qui porte en même temps les cours, le travail, la maison et les notifications sans fin du téléphone, et qui se demande le soir venu : « Mais qu’est-ce que j’ai fait aujourd’hui ? »" },
        { id: "g2", type: "p", text: "Tu ne trouveras pas ici de grand système. Pas d’agendas à code couleur, pas de routines matinales en vingt étapes, pas de promesse de tout changer du jour au lendemain. Il y a trois petites idées : déposer quelque part ce que tu as en tête, choisir une seule tâche principale pour aujourd’hui, et pouvoir changer de plan quand la journée change." },
        { id: "g3", type: "p", text: "Chaque chapitre est assez court pour être lu pendant un trajet en bus. À la fin de chacun, il y a un exercice de quelques minutes. Tu peux le faire sur papier ou dans le planificateur de cette application, comme tu préfères." },
        { id: "g4", type: "p", text: "Je parlerai par endroits de recherches. J’aimerais que tu les lises non pas comme « la science l’a prouvé », mais comme « voici ce qu’on a observé chez certaines personnes, dans certaines conditions ». Tu verras ce que dit la recherche et ce que je te suggère dans des encadrés séparés. Savoir lequel est lequel t’aide à décider ce que tu veux garder pour ta propre vie." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "Tu n’as pas à tout garder en tête",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "8 h 10 du matin. Camille est debout dans le métro, près de la porte. D’une main, elle se tient à la barre ; de l’autre, elle consulte ses e-mails sur son téléphone.",
            "Ses pensées n’arrivent pas dans l’ordre. Le devoir à rendre vendredi. Le message à écrire au propriétaire au sujet du loyer. Le colis à retourner, qu’il faut déposer au point relais. L’anniversaire de sa mère, la semaine prochaine. Le formulaire de candidature au stage, à moitié rempli. Et puis, hier soir, elle a dit à une amie : « Je t’appelle demain. » Mais quand, au juste ?",
            "Alors que la rame approche de la station, une sensation familière monte en elle : j’oublie quelque chose, mais quoi ? La journée n’a même pas commencé, et elle est déjà fatiguée.",
          ],
        },

        { id: "b1-h1", type: "h", text: "La tête : un bon pense-bête, un mauvais entrepôt" },
        { id: "b1-p1", type: "p", text: "Le problème de Camille, ce n’est ni la paresse ni le désordre. C’est que toutes ses tâches se trouvent au même moment au même endroit : dans sa tête." },
        { id: "b1-p2", type: "p", text: "Tant qu’une tâche inachevée n’est notée nulle part, elle se rappelle à toi de temps en temps. Le colis te revient en tête pendant un cours, le devoir pendant le repas. Ces rappels sont parfois utiles. Mais ils ne choisissent ni leur ordre ni leur moment. Une tâche importante et une tâche sans importance t’appellent de la même voix." },
        { id: "b1-p3", type: "p", text: "Au final, tu te retrouves avec vingt pensées à moitié commencées, sans pouvoir aller au bout d’aucune. C’est peut-être l’une des raisons pour lesquelles on peut se sentir occupé toute la journée et avoir, le soir, l’impression de n’avoir rien fait." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "Dans une série d’expériences, les participants à qui l’on rappelait un objectif inachevé avaient l’esprit qui revenait plus souvent vers cet objectif pendant une lecture sans rapport. Quand on leur permettait de faire un plan précis pour ce même objectif, cet effet disparaissait.",
          limits: "Les expériences ont été menées en laboratoire, surtout avec des étudiants. Le résultat ne sera pas forcément le même pour tout le monde dans la vie quotidienne.",
          details: "Selon les chercheurs, ce qui faisait la différence n’était pas seulement de se souvenir de la tâche, mais de se donner un plan concret pour elle. Dans ce livre, écrire est la première étape ; le plan est le sujet du deuxième chapitre.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "À quoi sert concrètement d’écrire" },
        { id: "b1-p4", type: "p", text: "Écrire ce que tu as en tête, ce n’est pas promettre de tout faire. C’est plutôt comme garer ces tâches quelque part. Quand ta voiture est au parking, tu n’as pas besoin d’y penser sans arrêt ; il suffit de savoir où elle est." },
        { id: "b1-p5", type: "p", text: "Une liste posée sur le papier rend trois services concrets. D’abord, elle te permet de comparer tes tâches. Dans ta tête, elles semblent toutes de la même taille ; une fois écrites, tu remarques que certaines prennent deux minutes et d’autres deux semaines. Ensuite, elle apaise la peur d’oublier, puisque c’est désormais le papier qui se souvient à ta place. Enfin, elle facilite l’étape suivante : décider ce que tu vas choisir aujourd’hui." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "À gauche, de courts traits et des boucles de tailles différentes, emmêlés les uns aux autres ; au milieu, une flèche mène à une feuille aux lignes bien rangées, à droite. Sur la feuille, quelques lignes, et une petite marque à côté de l’une d’elles.",
          caption: "Dans ta tête, tout s’emmêle. Sur le papier, les mêmes tâches se mettent en file et deviennent comparables.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "Dans une étude menée dans un laboratoire du sommeil, les jeunes adultes qui avaient écrit pendant cinq minutes avant de se coucher ce qu’ils avaient à faire dans les jours suivants se sont endormis en moyenne plus vite que ceux qui avaient écrit ce qu’ils avaient terminé ces derniers jours.",
          limits: "Une seule nuit, un petit groupe de 57 personnes sans troubles du sommeil. Cela ne montre pas qu’écrire améliorera le sommeil de tout le monde.",
          details: "Ceux qui avaient détaillé davantage leurs tâches à faire se sont aussi endormis plus vite. Ce résultat est à lire comme un indice que faire passer la liste de la tête au papier peut soulager, et non comme une conclusion définitive.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "Tu n’as pas à réorganiser toute ta vie" },
        { id: "b1-p6", type: "p", text: "À ce stade, la première idée qui vient est souvent un grand ménage : télécharger une nouvelle application, tout ranger par catégories, des couleurs, des étiquettes, des niveaux de priorité. Une semaine plus tard, le système est devenu une tâche de plus à entretenir." },
        { id: "b1-p7", type: "p", text: "Ce n’est pas nécessaire. Dans ce chapitre, la seule chose que tu vas faire, c’est sortir de ta tête, pendant quelques minutes, ce qui s’y trouve. Pas de classement, pas d’ordre, pas de plan. On y viendra au deuxième chapitre, et là encore, on choisira une seule tâche, pas vingt." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Garde ta liste à un seul endroit. Si tu écris un jour dans l’appli de notes du téléphone, le lendemain sur une feuille et le surlendemain dans un brouillon de message, ta tête va cette fois essayer de se souvenir où sont tes listes. Peu importe l’endroit ; l’important, c’est que ce soit toujours le même.",
        },

        { id: "b1-p8", type: "p", text: "Une chose encore peut t’être utile : ta liste va paraître en désordre. « Appeler maman » côtoiera « Réfléchir à ce que je ferai après mon diplôme ». C’est normal. La liste n’est pas là pour être bien rangée, mais pour rendre visible ce que tu portes dans ta tête." },
        { id: "b1-h4", type: "h", text: "Et si la liste s’allonge ?" },
        { id: "b1-p10", type: "p", text: "Beaucoup de gens qui écrivent tout pour la première fois ont un mouvement de recul en voyant la liste. Quinze, vingt lignes. « J’ai tout ça à faire ? » En réalité, ces tâches étaient déjà là ; simplement, maintenant, on peut les compter." },
        { id: "b1-p11", type: "p", text: "Une longue liste ne veut pas dire que tu dois tout faire aujourd’hui. Certaines lignes tiennent en un message, d’autres concernent un sujet qui va durer des mois, et d’autres encore ne sont pas vraiment des tâches, mais des inquiétudes : « Est-ce que je vais trouver un stage ? » Pour l’instant, tu n’as rien à faire pour les trier. Rien que de voir qu’elles ne sont pas toutes de la même nature peut déjà alléger un peu la charge." },
        { id: "b1-p12", type: "p", text: "Il se peut aussi que des choses te viennent en tête que tu n’as pas envie d’écrire. Rien ne t’oblige à tout noter. Personne ne verra cette liste ; elle n’est pas là pour te mettre à l’épreuve, mais pour libérer un peu de place dans ta tête." },
        { id: "b1-p13", type: "p", text: "Tu remarqueras peut-être autre chose : certaines tâches rétrécissent dès qu’elles sont écrites. « Message au propriétaire » ressemblait dans ta tête à une grande conversation ; sur le papier, cela devient un message de deux phrases. Ce n’est pas le cas pour toutes les tâches, mais quand ça arrive, ça fait du bien." },
        { id: "b1-p9", type: "p", text: "Ce matin-là, en sortant du métro, Camille a noté dans son téléphone, pendant trois minutes, tout ce qui lui venait à l’esprit. Cela a donné quatorze lignes. Elle n’en a fait aucune sur le moment. Mais quand elle a vu qu’elle appellerait son amie à la pause déjeuner et qu’elle déposerait le colis au point relais en rentrant le soir, le reste s’est un peu tu." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "Vider sa tête en trois minutes",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Lance un minuteur de trois minutes. Tu peux aussi utiliser le bouton ci-dessous.",
            "Écris chaque tâche qui te vient, sans ordre et en quelques mots. Ne fais pas de différence entre grandes et petites : « Message loyer », « Devoir », « Rendez-vous dentiste ».",
            "Ne fais pas de phrases qui commencent par « Je dois » ; le nom de la tâche suffit.",
            "Arrête-toi quand le minuteur sonne. La liste peut rester incomplète ; ce qui manque pourra être ajouté plus tard.",
            "Tu n’as rien à faire de cette liste pour l’instant. Sache simplement qu’elle est là.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Écrire quelque part les tâches que tu as en tête ne t’oblige pas à les faire tout de suite ; cela te permet simplement d’arrêter de toutes les porter en même temps.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Donne à ta journée une tâche principale",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Mardi matin, 10 h. Camille est à la bibliothèque, à une table près de la fenêtre. Devant elle, la liste de la veille : quatorze lignes.",
            "Elle ouvre d’abord le fichier de son devoir. Quelques minutes plus tard, elle se souvient de la date limite du formulaire de stage et l’ouvre. En cherchant le document demandé dans le formulaire, elle pense à vérifier le délai pour retourner le colis. Puis elle revient à son devoir.",
            "Vers midi, sept onglets sont ouverts à l’écran. Aucune tâche n’est terminée. Camille sait qu’elle a travaillé toute la matinée, mais elle n’a rien à montrer.",
          ],
        },

        { id: "b2-h1", type: "h", text: "Une liste n’est pas un plan" },
        { id: "b2-p1", type: "p", text: "Au premier chapitre, tu as écrit quelque part ce que tu avais en tête. Cela allège la charge ; mais cela ne te dit pas par quoi commencer aujourd’hui. Une liste est un inventaire. Quand on regarde quatorze lignes à la fois, on peut se mettre à penser que chacune est plus urgente que les autres." },
        { id: "b2-p2", type: "p", text: "C’est ainsi que s’est passée la matinée de Camille. Chaque tâche était légitime, chaque changement avait sa logique. Mais en passant de l’une à l’autre, elle devait chaque fois se rappeler où elle en était. La journée s’est remplie de débuts inachevés." },
        { id: "b2-p3", type: "p", text: "Ce que je te propose dans ce chapitre est simple : choisis une tâche principale pour chaque journée. Pas besoin que ce soit la tâche la plus importante de ta vie. Le critère est le suivant : si, ce soir, cette tâche est terminée ou a avancé, est-ce que ce sera un soulagement pour toi ? Si la réponse est oui, c’est la tâche principale du jour." },
        { id: "b2-p4", type: "p", text: "Les autres tâches ne disparaissent pas ; elles attendent sur la liste. Choisir une tâche principale, ce n’est pas renoncer aux autres, c’est simplement décider qu’aujourd’hui, elles passent après." },

        { id: "b2-h5", type: "h", text: "Quand choisir te semble difficile" },
        { id: "b2-p12", type: "p", text: "Certains matins, deux ou trois tâches paraissent tout aussi urgentes. Ces jours-là, quelques questions peuvent t’aider à choisir. Laquelle a l’échéance la plus proche ? Laquelle, si elle n’est pas faite, bloque aussi d’autres tâches ? Laquelle te pèse le plus sur la poitrine quand tu y penses ?" },
        { id: "b2-p13", type: "p", text: "Ces questions n’ont pas toujours de réponse claire. Dans ce cas, même tirer à pile ou face peut valoir mieux que ne rien choisir du tout. Choisir la « mauvaise » tâche principale fatigue souvent moins que de faire des allers-retours entre trois tâches toute la journée ; parce qu’au moins, l’une d’elles avance." },
        { id: "b2-p14", type: "p", text: "Autre chose : la tâche principale n’a pas besoin d’être une grosse tâche tous les jours. Un jour où tu manques d’énergie, où tu sors tout juste d’un examen ou où tu es malade, la tâche principale peut être « Faire une lessive ». La tâche principale se choisit selon ce que la journée te permet, pas selon ce que la personne que tu voudrais être pourrait faire." },

        { id: "b2-h2", type: "h", text: "Transformer la tâche principale en un petit pas" },
        { id: "b2-p5", type: "p", text: "« Écrire le devoir » peut être une bonne tâche principale, mais c’est un mauvais point de départ. C’est trop gros ; tu ne sais pas par quel bout le prendre. Ce qui facilite le démarrage, c’est le premier petit pas de la tâche principale : une action assez concrète pour être faite en quelques minutes." },
        { id: "b2-p6", type: "p", text: "Quelques exemples : au lieu de « Écrire le devoir », « Ouvrir le fichier du devoir et écrire trois titres ». Au lieu de « Candidature de stage », « Trouver le document manquant du formulaire et le mettre dans le dossier ». Au lieu de « Parler au propriétaire », « Écrire la première phrase du message sur le loyer »." },
        { id: "b2-p7", type: "p", text: "Le but du premier pas n’est pas de finir la tâche, mais d’y entrer. Parfois, une fois le premier pas fait, tu continues ; parfois non. Les deux sont possibles. Mais il y a une différence entre attendre devant une page blanche et revenir à une page où trois titres sont déjà écrits." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "À gauche, une grande boîte contenant quelques lignes ; une flèche mène à quatre petites marches qui montent vers la droite. Un point orange est posé sur la première marche, la plus basse.",
          caption: "On ne franchit pas une grande tâche d’un seul bond. La première marche doit être assez basse pour être montée aujourd’hui.",
        },

        { id: "b2-h3", type: "h", text: "Quand et où ?" },
        { id: "b2-p8", type: "p", text: "Une fois le premier pas choisi, il reste une question : quand et où vas-tu le faire ? « À un moment aujourd’hui » glisse souvent jusqu’à la fin de la journée. « Après le déjeuner, à l’étage de la bibliothèque », en revanche, s’installe dans ta tête comme un rendez-vous." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "Les plans que le psychologue Peter Gollwitzer appelle « intentions de mise en œuvre » consistent à décider à l’avance quand, où et comment on va agir pour un objectif : « Quand la situation X se présente, je fais Y. » Dans une méta-analyse réunissant 94 tests indépendants, les participants qui faisaient ce type de plan atteignaient leurs objectifs, en moyenne, nettement plus souvent que ceux qui se fixaient seulement un objectif.",
          limits: "L’ampleur de l’effet variait d’une étude à l’autre, et une partie des recherches a été menée en laboratoire ou avec des étudiants. Un effet moyen ne montre pas que le plan fonctionnera pour tout le monde et pour toutes les tâches.",
          details: "Selon les chercheurs, ces plans facilitent le démarrage au bon moment parce que la décision « Quand est-ce que je commence ? » a déjà été prise. Dans ce livre, la partie « Choisir quand je commence » de « Ma journée » s’appuie sur cette idée.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Plutôt qu’une heure précise, essaie de rattacher ton premier pas à un moment qui existe déjà dans ta journée : « Après mon premier cours », « Quand mon café est prêt », « Quand je rentre et que je pose mon sac ». Les horaires glissent ; ce genre de moment, lui, revient presque tous les jours.",
        },

        { id: "b2-h4", type: "h", text: "Tâches en plus et choses qui attendront demain" },
        { id: "b2-p9", type: "p", text: "À côté de la tâche principale, il y aura aussi de petites choses à faire dans la journée. Dans « Ma journée », il n’y a que deux places pour elles. Cela peut ressembler à une contrainte ; c’est en fait un repère. S’il te faut plus de deux lignes, c’est peut-être que la journée est déjà bien remplie, et il est normal que certaines tâches attendent demain." },
        { id: "b2-p10", type: "p", text: "Une tâche remise à demain n’est pas un échec, c’est une décision. Si elle reste sur la liste, c’est qu’elle n’est pas oubliée." },
        { id: "b2-p11", type: "p", text: "Ce jour-là, après le déjeuner, Camille a fermé tous ses onglets. Sa tâche principale, c’était le devoir ; son premier pas, ouvrir le fichier et écrire trois titres. Elle s’est assise à une table libre à l’étage. Les titres lui ont pris dix minutes. Ensuite, elle a écrit quelques paragraphes sous le premier. Le formulaire de stage et le colis sont devenus les tâches en plus du lendemain." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "La tâche principale du jour",
          planner: "main",
          steps: [
            "Regarde ta liste et pose-toi cette question : laquelle de ces tâches, si elle avait avancé ce soir, me soulagerait ?",
            "Écris-la comme tâche principale du jour.",
            "En dessous, écris le premier petit pas par lequel tu peux commencer en quelques minutes.",
            "Si tu veux, ajoute aussi quand et où tu vas commencer : par exemple « Après le déjeuner, à mon bureau ».",
            "Le reste peut attendre sur la liste. Pour aujourd’hui, c’est suffisant.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "Une seule tâche principale pour aujourd’hui, avec un petit premier pas, c’est souvent plus facile que d’essayer de commencer en regardant une longue liste.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Adapte ton plan à ta vie",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Jeudi. Le plan de Camille était clair : après le déjeuner, à la bibliothèque, la deuxième partie du devoir.",
            "Mais la réunion de groupe s’est éternisée. À la sortie, il s’est mis à pleuvoir. Quand elle est arrivée chez elle, il était plus de 18 h ; trempée, fatiguée et un peu énervée.",
            "La phrase qui lui a traversé l’esprit lui était familière : « De toute façon, la journée est fichue. Demain, je repars sur de bonnes bases. »",
          ],
        },

        { id: "b3-h1", type: "h", text: "Quand le plan déraille" },
        { id: "b3-p1", type: "p", text: "Un plan fait le matin est une prévision de la façon dont la journée va se passer. Les réunions durent plus longtemps, les bus sont en retard, l’énergie s’épuise plus tôt que prévu. Si le plan ne tient pas, ce n’est pas une faute de la personne qui l’a fait ; c’est la nature même des prévisions." },
        { id: "b3-p2", type: "p", text: "Le problème, souvent, ce n’est pas le plan qui déraille, mais la pensée « tout ou rien » qui suit. Si le plan ne peut pas être suivi à la lettre, on a l’impression qu’il ne sert plus à rien. Pourtant, la plupart des jours, il reste trois options." },
        { id: "b3-p3", type: "p", text: "La première : décaler le moment. « Cet après-midi, ça n’a pas marché ; une demi-heure après le dîner. » La deuxième : réduire le pas. « Je ne peux pas écrire la deuxième partie, mais je peux relire mes notes une fois. » La troisième : reporter en connaissance de cause. « Aujourd’hui, je ne le fais pas ; demain matin, c’est la première chose que je fais. » Ce sont trois décisions. La journée perdue, elle, c’est celle où l’on ne décide rien." },

        { id: "b3-h2", type: "h", text: "Une option plus petite pour les jours difficiles" },
        { id: "b3-p4", type: "p", text: "Un jour où tout va bien, le premier pas est facile. C’est dans les jours difficiles que le plan est vraiment mis à l’épreuve. C’est pourquoi il peut être utile de prévoir à l’avance une « option plus petite » : une solution de secours assez petite pour que tu puisses la faire même un mauvais jour." },
        { id: "b3-p5", type: "p", text: "Pour le devoir, ce peut être ouvrir le fichier et écrire une seule phrase. Pour la marche, sortir devant chez toi et faire un tour de cinq minutes. Pour la lecture, une page. L’option plus petite n’est pas là pour que la tâche compte comme faite, mais pour ne pas perdre le lien avec elle." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "Un chemin en pointillés va de gauche à droite et contourne un obstacle placé au milieu avant de continuer. En bas, sept petits carrés : la plupart sont remplis, un est vide, et un point orange se trouve à côté du dernier.",
          caption: "Le plan peut contourner l’obstacle. Un vide sur l’un des sept jours ne veut pas dire que le chemin s’arrête là.",
        },

        { id: "b3-h3", type: "h", text: "Manquer un jour" },
        { id: "b3-p6", type: "p", text: "Quand on essaie une nouvelle habitude, sauter un jour donne à beaucoup de gens l’impression de devoir tout recommencer depuis le début. Les compteurs de séries entretiennent ce sentiment : une chaîne de trente jours retombe à zéro en une seule journée." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "Dans une étude menée à Londres, 96 volontaires ont choisi un comportement lié à l’alimentation, à la boisson ou à l’activité physique, à pratiquer chaque jour dans la même situation, et ont évalué eux-mêmes chaque jour, pendant 12 semaines, à quel point ce comportement était devenu automatique. Manquer une seule occasion n’a pas perturbé de façon notable le processus de formation de l’habitude. Le temps nécessaire pour que le comportement devienne presque automatique variait beaucoup d’une personne à l’autre : entre 18 et 254 jours.",
          limits: "Un petit groupe de volontaires et des comportements quotidiens simples. L’automatisme a été mesuré à partir de l’évaluation des participants eux-mêmes, et les données de certains participants ne correspondaient pas bien au modèle. Les résultats pourraient être différents pour des comportements plus complexes.",
          details: "Dans l’étude, la durée médiane était de 66 jours ; mais ce n’est ni une moyenne ni un objectif. Ce résultat laisse penser que les durées fixes du type « une habitude en 21 jours » ne conviennent pas à tout le monde, et que manquer un jour de temps en temps ne remet pas le processus à zéro.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "Quand tu essaies une habitude, commence par un court essai de sept jours. Le but n’est pas d’acquérir l’habitude en sept jours ; c’est de voir si le moment, le lieu et le pas que tu as choisis te conviennent. Modifier le plan au bout des sept jours fait partie de l’essai.",
        },

        { id: "b3-h5", type: "h", text: "Si le plan ne te convient pas" },
        { id: "b3-p10", type: "p", text: "Parfois, le problème n’est pas un seul mauvais jour. Si le même plan ne tient pas plusieurs jours de suite, c’est peut-être le signe que ce n’est pas le plan qui s’adapte à toi, mais toi qui essaies de t’adapter au plan. Pour quelqu’un qui prévoit d’aller courir à 7 h mais qui éteint son réveil tous les matins, la vraie question n’est peut-être pas « Pourquoi je n’y arrive pas ? », mais « Est-ce que cette heure me convient vraiment ? »" },
        { id: "b3-p11", type: "p", text: "Pour modifier ton plan, tu peux regarder trois choses : le moment, le lieu et la taille du pas. Souvent, en changer une seule suffit. Le soir au lieu du matin, la bibliothèque au lieu de la maison, dix minutes au lieu d’une demi-heure. L’objectif peut rester le même ; seul le chemin pour y arriver change." },
        { id: "b3-p12", type: "p", text: "En faisant ces changements, il peut être utile de te voir comme quelqu’un qui mène une expérience. Une expérience ne donne pas toujours le résultat attendu ; cela ne veut pas dire que la personne qui la mène a échoué, seulement que cela montre ce qu’il faut changer au prochain essai." },

        { id: "b3-h4", type: "h", text: "Deux questions le soir" },
        { id: "b3-p7", type: "p", text: "En fin de journée, au lieu de compter quelle part de ton plan s’est réalisée, essaie de te poser deux questions : qu’est-ce qui a marché aujourd’hui ? Qu’est-ce que je peux me faciliter pour demain ? La première t’aide à remarquer ce qui fonctionne. La seconde ajuste un peu le plan du lendemain en fonction de ce que tu as vécu aujourd’hui." },
        { id: "b3-p8", type: "p", text: "Les réponses peuvent être toutes petites : « Mettre le téléphone dans une autre pièce, ça a marché. » « Demain, je prépare mon sac la veille. » C’est comme ça que les plans s’adaptent à la vie, par de petits ajustements, jour après jour." },
        { id: "b3-p9", type: "p", text: "Ce jeudi soir-là, Camille a ouvert le fichier de son devoir et a écrit une seule phrase pour la deuxième partie. Puis elle est allée se coucher. Le lendemain matin, en ouvrant le fichier, ce n’est pas une page blanche qui l’attendait, mais une phrase." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "Un petit essai de sept jours",
          planner: "habit",
          steps: [
            "Choisis une seule habitude que tu as envie d’essayer.",
            "Écris le plus petit début réalisable : assez petit pour que tu puisses le faire même un mauvais jour.",
            "Rattache-le à un moment qui existe déjà dans ta journée et décide où tu le feras.",
            "Ajoute une option plus petite pour les jours difficiles.",
            "Pendant sept jours, chaque soir, coche seulement l’une de ces cases : je l’ai fait, j’ai fait la version plus petite, ou je ne l’ai pas fait. Ensuite, regarde ton plan à nouveau.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "Quand un plan déraille, plutôt que de l’abandonner, il est souvent possible de décaler son moment ou de réduire son pas ; et manquer un jour ne veut pas dire que le chemin s’arrête là.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Pour finir",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "Ce livre contenait trois petites idées : déposer quelque part ce que tu as en tête, choisir une seule tâche principale pour aujourd’hui avec son premier pas, et pouvoir changer de plan quand la journée change." },
        { id: "k2", type: "p", text: "Aucune ne rendra chaque journée facile. Certains jours, la liste restera longue, la tâche principale n’avancera pas, l’essai aura des ratés. Cela ne veut pas dire que la méthode a échoué, ni toi. Le lendemain, tu pourras de nouveau choisir une tâche principale." },
        { id: "k3", type: "p", text: "Le planificateur et la partie habitude restent là, même une fois le livre terminé. Certains jours, tu peux l’ouvrir juste pour écrire la tâche principale du jour ; d’autres jours, tu peux ne pas l’ouvrir du tout. Tes entrées sont conservées uniquement sur cet appareil ; pense à faire une sauvegarde de temps en temps." },
        { id: "k4", type: "p", text: "Les petits pas ne règlent pas tout. Mais la plupart des jours, ils peuvent suffire pour commencer." },
      ],
    },
  ],
};
