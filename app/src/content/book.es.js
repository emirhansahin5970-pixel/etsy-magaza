/*
 * Contenido del libro (español): "Pequeños pasos, días más claros"
 * Traducción de book.tr.js: mismos capítulos e ids de bloque. La bibliografía solo está en book.tr.js.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.es = {
  lang: "es",
  title: "Pequeños pasos, días más claros",
  subtitle: "Una lectura breve y un planificador diario sin presiones",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Para empezar",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "Este libro breve está escrito para quien intenta sacar el día adelante. Para quien carga a la vez con las clases, el trabajo, la casa y las notificaciones interminables del móvil, y al llegar la noche se pregunta: “¿Pero qué he hecho hoy?”." },
        { id: "g2", type: "p", text: "Aquí no vas a encontrar un gran sistema. No hay agendas con códigos de colores, ni rutinas matutinas de veinte pasos, ni la promesa de cambiarlo todo de la noche a la mañana. Hay tres ideas pequeñas: dejar en algún sitio lo que tienes en la cabeza, elegir una sola tarea principal para hoy y poder cambiar el plan cuando cambia el día." },
        { id: "g3", type: "p", text: "Cada capítulo es lo bastante corto como para leerlo en un trayecto en autobús. Al final de cada uno hay un ejercicio de pocos minutos. Puedes hacerlo en papel o en el planificador de esta aplicación, como prefieras." },
        { id: "g4", type: "p", text: "De vez en cuando hablaré de investigaciones. Me gustaría que no las leyeras como “la ciencia lo ha demostrado”, sino como “con ciertas personas, en ciertas condiciones, se observó esto”. Lo que dice la investigación y lo que te sugiero yo aparecerán en recuadros distintos. Saber cuál es cuál te ayudará a decidir qué quieres llevarte a tu propia vida." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "No tienes que llevarlo todo en la cabeza",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "Son las 8:10 de la mañana. Lucía va de pie en el metro, junto a la puerta. Con una mano se agarra a la barra; con la otra revisa el correo en el móvil.",
            "Lo que le pasa por la cabeza no llega en orden. El trabajo que tiene que entregar el viernes. El mensaje que debe escribirle al casero sobre el alquiler. El paquete de devolución que tiene que llevar a la oficina de envíos. El cumpleaños de su madre, la semana que viene. El formulario a medio rellenar de la solicitud de prácticas. Y anoche le dijo a una amiga: “Mañana te llamo”. ¿Cuándo pensaba llamarla?",
            "Mientras el metro se acerca a la estación, aparece una sensación conocida: se me está olvidando algo, pero ¿qué? Y el día ni siquiera ha empezado y ya está cansada.",
          ],
        },

        { id: "b1-h1", type: "h", text: "La mente recuerda bien, pero guarda mal" },
        { id: "b1-p1", type: "p", text: "El problema de Lucía no es la pereza ni el desorden. El problema es que todas sus tareas están a la vez en el mismo lugar: dentro de su cabeza." },
        { id: "b1-p2", type: "p", text: "Una tarea sin terminar, mientras no se anote en algún sitio, vuelve a recordarse de vez en cuando. Te acuerdas del paquete en mitad de una clase y del trabajo mientras comes. A veces estos recordatorios sirven. Pero no eligen ni su orden ni su momento. Una tarea importante y una sin importancia te llaman con la misma voz." },
        { id: "b1-p3", type: "p", text: "Al final tienes veinte pensamientos a medias y no puedes pensar a fondo en ninguno. Esa puede ser una de las razones por las que pasas el día sin parar y, por la noche, tienes la impresión de no haber hecho nada." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "En una serie de experimentos, a los participantes a quienes se les recordaba una meta sin cumplir se les iba la mente hacia esa meta con más frecuencia durante una lectura que no tenía nada que ver. Cuando se les permitía hacer un plan concreto para esa misma meta, el efecto desaparecía.",
          limits: "Los experimentos se hicieron en laboratorio, sobre todo con estudiantes universitarios. En la vida diaria puede que no tenga el mismo resultado en todo el mundo.",
          details: "Según los investigadores, lo que marcó la diferencia no fue solo recordar la tarea, sino armar un plan concreto para ella. En este libro, escribir es el primer paso; el plan es el tema del segundo capítulo.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "Para qué sirve escribir" },
        { id: "b1-p4", type: "p", text: "Escribir lo que tienes en la cabeza no es prometer que vas a hacerlo todo. Se parece más a aparcarlo en algún sitio. Mientras el coche está en el aparcamiento, no necesitas seguir pensando en él; te basta con saber dónde está." },
        { id: "b1-p5", type: "p", text: "Una lista en papel cumple tres funciones concretas. La primera: te permite comparar las tareas. En tu cabeza todas parecen del mismo tamaño; al escribirlas, te das cuenta de que unas son de dos minutos y otras de dos semanas. La segunda: reduce el miedo a olvidar, porque ahora el papel se encarga de recordar. La tercera: facilita el siguiente paso, es decir, decidir qué vas a elegir hoy." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "A la izquierda, trazos cortos y anillos de distintos tamaños enredados entre sí; desde el centro, una flecha llega a una hoja con renglones ordenados a la derecha. En la hoja hay algunas líneas y, junto a una de ellas, una pequeña marca.",
          caption: "Dentro de la cabeza todo se enreda. En el papel, las mismas tareas se ponen en fila y se pueden comparar.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "En un estudio realizado en un laboratorio del sueño, los adultos jóvenes que pasaron cinco minutos antes de acostarse escribiendo lo que tenían que hacer en los próximos días se durmieron, de media, más rápido que quienes escribieron lo que habían terminado en los últimos días.",
          limits: "Una sola noche y un grupo pequeño de 57 personas sin problemas de sueño. No demuestra que escribir vaya a mejorar el sueño de todo el mundo.",
          details: "Quienes escribieron sus tareas pendientes con más detalle también se durmieron antes. Este hallazgo debe leerse como una pista de que pasar la lista de la cabeza al papel puede resultar tranquilizador, no como una conclusión definitiva.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "No necesitas organizar toda tu vida" },
        { id: "b1-p6", type: "p", text: "En este punto, lo primero que se le suele ocurrir a uno es hacer una gran limpieza: descargar una aplicación nueva, dividirlo todo en categorías, colores, etiquetas, niveles de prioridad. Una semana después, el sistema se ha convertido en una tarea más que hay que mantener." },
        { id: "b1-p7", type: "p", text: "No hace falta. Lo único que vas a hacer en este capítulo es sacar de tu cabeza, durante unos minutos, lo que tienes dentro. Sin clasificar, sin ordenar, sin planificar. A esa parte llegaremos en el segundo capítulo, y allí también elegiremos una sola tarea, no veinte." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Ten la lista en un solo lugar. Si un día escribes en las notas del móvil, al día siguiente en un papel y al otro en el borrador de un mensaje, tu mente pasará a intentar recordar dónde están las listas. No importa qué lugar sea; importa que sea siempre el mismo.",
        },

        { id: "b1-p8", type: "p", text: "Y algo que te puede venir bien saber: tu lista se va a ver desordenada. “Llamar a mamá” estará justo encima de “Pensar qué hacer después de graduarme”. Es normal. La lista no está para ser ordenada, sino para hacer visible la carga que llevas en la cabeza." },
        { id: "b1-h4", type: "h", text: "¿Y si la lista se alarga?" },
        { id: "b1-p10", type: "p", text: "Mucha gente que lo escribe todo por primera vez se echa un poco atrás al ver la lista que sale. Quince, veinte líneas. “¿De verdad tengo tantas cosas que hacer?”. En realidad, esas tareas ya estaban ahí; solo que ahora se pueden contar." },
        { id: "b1-p11", type: "p", text: "Una lista larga no significa que tengas que hacerlo todo hoy. Algunas líneas son cosa de un mensaje, otras son asuntos que durarán meses y otras, en realidad, no son tareas sino preocupaciones: “¿Encontraré unas prácticas?”. Por ahora no tienes que hacer nada para separarlas. Solo ver que no todas son del mismo tipo ya puede aligerar un poco la carga." },
        { id: "b1-p12", type: "p", text: "Puede que, mientras escribes, se te ocurran cosas que no quieres poner por escrito. No tienes por qué escribirlo todo. Esta lista no se la vas a enseñar a nadie; su propósito no es ponerte a prueba, sino hacerte un poco de sitio en la cabeza." },
        { id: "b1-p13", type: "p", text: "También puede que notes algo: algunas tareas se encogen en cuanto las escribes. “Mensaje al casero”, que en tu cabeza parecía una gran conversación, en el papel se convierte en un mensaje de dos frases. No pasa con todas, pero cuando pasa, sienta bien." },
        { id: "b1-p9", type: "p", text: "Esa mañana, al bajarse del metro, Lucía pasó tres minutos escribiendo en las notas del móvil todo lo que se le ocurría. Le salieron catorce líneas. No hizo ninguna en ese momento. Pero al ver que llamaría a su amiga a la hora de comer y que dejaría el paquete de devolución en la oficina de envíos de camino a casa, el resto se quedó un poco más en silencio." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "Vaciar la cabeza en tres minutos",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Pon un temporizador de tres minutos. También puedes usar el botón de abajo.",
            "Escribe cada tarea que se te ocurra, sin orden y en pocas palabras. No distingas entre grandes y pequeñas: “Mensaje del alquiler”, “Trabajo de clase”, “Cita con el dentista”.",
            "No escribas frases que empiecen por “Tengo que”; basta con el nombre de la tarea.",
            "Cuando suene el temporizador, para. La lista puede quedar incompleta; lo que falte se puede añadir después.",
            "Por ahora no tienes que hacer nada con la lista. Basta con saber que está ahí.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Escribir en algún sitio lo que tienes en la cabeza no te obliga a hacerlo enseguida; solo te permite dejar de cargar con todo a la vez.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Dale al día una tarea principal",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Martes, 10:00 de la mañana. Lucía está en la biblioteca, en la mesa junto a la ventana. Delante tiene la lista de ayer: catorce líneas.",
            "Primero abre el archivo del trabajo. A los pocos minutos se acuerda del plazo del formulario de prácticas y lo abre. Mientras busca el documento que le piden, se le ocurre mirar cuánto tiempo le queda para devolver el paquete. Luego vuelve al trabajo.",
            "Cerca del mediodía tiene siete pestañas abiertas en la pantalla. No ha terminado ninguna. Lucía sabe que ha estado trabajando toda la mañana, pero no tiene nada que enseñar.",
          ],
        },

        { id: "b2-h1", type: "h", text: "Una lista no es un plan" },
        { id: "b2-p1", type: "p", text: "En el primer capítulo escribiste en algún sitio lo que tenías en la cabeza. Eso aligera la carga, pero no te dice por dónde empezar hoy. Una lista es un inventario. Quien mira catorce líneas a la vez puede empezar a pensar que cada una es más urgente que la anterior." },
        { id: "b2-p2", type: "p", text: "Así fue la mañana de Lucía. Cada tarea tenía sentido; cada cambio era lógico. Pero al saltar de una tarea a otra, cada vez tenía que volver a recordar dónde se había quedado. El día se llenó de comienzos a medias." },
        { id: "b2-p3", type: "p", text: "Lo que te propongo en este capítulo es sencillo: elige una tarea principal para cada día. No tiene que ser la tarea más importante de tu vida. La medida es esta: si al llegar la noche esta tarea está terminada o ha avanzado, ¿sentirás alivio? Si la respuesta es sí, esa es la tarea principal de hoy." },
        { id: "b2-p4", type: "p", text: "Las demás tareas no desaparecen; esperan en la lista. Elegir una tarea principal no es renunciar a las demás, sino dejar para más tarde la decisión de cuándo ocuparte de ellas hoy." },

        { id: "b2-h5", type: "h", text: "Cuando cuesta elegir" },
        { id: "b2-p12", type: "p", text: "Algunas mañanas, dos o tres tareas parecen igual de urgentes. Esos días hay unas cuantas preguntas que pueden ayudarte a elegir. ¿Cuál tiene la fecha límite más cercana? ¿Cuál, si no se termina, deja otras tareas en espera? ¿Cuál te pesa más en el pecho cuando piensas en ella?" },
        { id: "b2-p13", type: "p", text: "Estas preguntas no siempre tienen una respuesta clara. En ese caso, hasta echarlo a cara o cruz puede ser mejor que no elegir. Elegir la tarea principal equivocada suele cansar menos que pasarse el día saltando entre tres tareas, porque al menos una avanza." },
        { id: "b2-p14", type: "p", text: "Y algo más: la tarea principal no tiene que ser cada día algo grande. Un día en que no te quedan fuerzas, acabas de salir de un examen o te encuentras mal, la tarea principal puede ser “Poner la lavadora”. La tarea principal se elige según lo que da de sí el día, no según lo que daría de sí la persona que te gustaría ser." },

        { id: "b2-h2", type: "h", text: "Convertir la tarea principal en un paso pequeño" },
        { id: "b2-p5", type: "p", text: "“Escribir el trabajo” puede ser una buena tarea principal, pero es un mal comienzo. Es demasiado grande; no sabes por dónde agarrarla. Lo que facilita empezar es el primer paso pequeño de la tarea principal: una acción lo bastante concreta como para hacerla en unos minutos." },
        { id: "b2-p6", type: "p", text: "Algunos ejemplos: en lugar de “Escribir el trabajo”, “Abrir el archivo del trabajo y escribir tres títulos”. En lugar de “Solicitud de prácticas”, “Buscar el documento que falta para el formulario y guardarlo en la carpeta”. En lugar de “Hablar con el casero”, “Escribir la primera frase del mensaje sobre el alquiler”." },
        { id: "b2-p7", type: "p", text: "El objetivo del primer paso no es terminar la tarea, sino meterte en ella. A veces, después del primer paso, sigues; a veces, no. Las dos cosas están bien. Pero no es lo mismo esperar delante de una página en blanco que volver a una página que ya tiene tres títulos escritos." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "A la izquierda, una caja grande con algunas líneas dentro; una flecha llega hasta cuatro escalones pequeños que suben hacia la derecha. Sobre el primero, el más bajo, hay un punto naranja.",
          caption: "Una tarea grande no se salva de un solo salto. El primer escalón tiene que ser lo bastante bajo como para subirlo hoy.",
        },

        { id: "b2-h3", type: "h", text: "¿Cuándo y dónde?" },
        { id: "b2-p8", type: "p", text: "Después de elegir el primer paso, queda una pregunta más: ¿cuándo y dónde lo vas a hacer? “Hoy en algún momento” suele acabar desplazándose al final del día. En cambio, “Después de comer, en la planta de arriba de la biblioteca” se queda en tu mente como una cita." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "Los planes que el psicólogo Peter Gollwitzer llama “intenciones de implementación” consisten en decidir de antemano cuándo, dónde y cómo vas a llevar a cabo una meta: “Cuando se dé la situación X, haré Y”. En un metaanálisis que reunió 94 pruebas independientes, la proporción de participantes que alcanzaron sus metas haciendo este tipo de planes fue, de media, claramente más alta que la de quienes solo se fijaron una meta.",
          limits: "El tamaño del efecto variaba de un estudio a otro, y parte de las investigaciones se hicieron en laboratorio o con estudiantes. Un efecto medio no demuestra que el plan vaya a funcionar para todo el mundo ni con cualquier tarea.",
          details: "Según los investigadores, como este tipo de plan toma de antemano la decisión de “¿cuándo empiezo?”, facilita empezar cuando llega el momento. En este libro, la sección “Decidir cuándo empiezo” de Mi día se basa en esta idea.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Prueba a no fijar el momento con una hora, sino a vincularlo con algo que ya ocurre durante tu día: “Después de la primera clase”, “Cuando me haya servido el café”, “Cuando llegue a casa y deje la mochila”. Las horas se desplazan; estos momentos, en cambio, vuelven casi todos los días.",
        },

        { id: "b2-h4", type: "h", text: "Tareas extra y lo que queda para mañana" },
        { id: "b2-p9", type: "p", text: "Además de la tarea principal, habrá pequeñas cosas que hacer a lo largo del día. En Mi día solo hay dos huecos para ellas. Puede parecer una limitación; en realidad, es una medida. Si necesitas más de dos líneas, quizá hoy ya sea un día lleno, y es natural que algunas tareas queden para mañana." },
        { id: "b2-p10", type: "p", text: "Una tarea que queda para mañana no es un fracaso, sino una decisión. Que siga en la lista significa que no se ha olvidado." },
        { id: "b2-p11", type: "p", text: "Ese día, después de comer, Lucía cerró todas las pestañas. Su tarea principal era el trabajo; su primer paso, abrir el archivo y escribir tres títulos. Se sentó en una mesa libre de la planta de arriba. Los títulos le llevaron diez minutos. Después escribió unos cuantos párrafos más bajo el primero. El formulario de prácticas y el paquete pasaron a ser las tareas extra del día siguiente." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "La tarea principal de hoy",
          planner: "main",
          steps: [
            "Mira tu lista y pregúntate: si esta noche hubiera avanzado, ¿cuál me daría más alivio?",
            "Escribe esa tarea como la tarea principal de hoy.",
            "Debajo, escribe el primer paso pequeño con el que puedes empezar en unos minutos.",
            "Si quieres, añade también cuándo y dónde vas a empezar: por ejemplo, “Después de comer, en mi mesa”.",
            "El resto de las tareas puede esperar en la lista. Por hoy, con esto basta.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "Una sola tarea principal para hoy, con un primer paso pequeño, suele ser más fácil que intentar empezar mirando una lista larga.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Adapta tu plan a tu vida",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Jueves. Lucía tenía el plan claro: después de comer, en la biblioteca, la segunda parte del trabajo.",
            "Pero la reunión de grupo se alargó. Al salir, empezó a llover. Cuando llegó a casa, ya eran más de las seis; estaba empapada, cansada y algo irritada.",
            "La frase que se le pasó por la cabeza le resultaba conocida: “Hoy ya está perdido. Mañana empiezo bien”.",
          ],
        },

        { id: "b3-h1", type: "h", text: "Cuando el plan se tuerce" },
        { id: "b3-p1", type: "p", text: "Un plan hecho por la mañana es una previsión de cómo irá el día. Las reuniones se alargan, los autobuses se retrasan, la energía se acaba antes de lo esperado. Que el plan no salga no es un fallo de quien lo hizo; así son las previsiones." },
        { id: "b3-p2", type: "p", text: "Muchas veces el problema no es el plan que se tuerce, sino el pensamiento de “todo o nada” que viene después. Si el plan no se puede cumplir tal cual, parece que no se cumple en absoluto. Sin embargo, casi todos los días hay tres opciones." },
        { id: "b3-p3", type: "p", text: "La primera, mover el momento: “Por la tarde no ha podido ser; media hora después de cenar”. La segunda, reducir el paso: “No puedo escribir la segunda parte, pero sí puedo leer mis apuntes una vez”. La tercera, aplazarlo a conciencia: “Hoy no lo hago; mañana por la mañana será lo primero”. Las tres son decisiones. El día que se pierde es el día en que no se decide nada." },

        { id: "b3-h2", type: "h", text: "Una opción más pequeña para los días difíciles" },
        { id: "b3-p4", type: "p", text: "En un día que va bien, el primer paso es fácil. Donde de verdad se pone a prueba un plan es en los días difíciles. Por eso puede servir decidir de antemano una “opción más pequeña”: un recurso de reserva tan pequeño que puedas hacerlo incluso en un mal día." },
        { id: "b3-p5", type: "p", text: "Para el trabajo, podría ser abrir el archivo y escribir una sola frase. Para caminar, salir a la puerta de casa y dar una vuelta de cinco minutos. Para leer, una página. La opción pequeña no existe para que la tarea cuente como hecha, sino para no perder el vínculo con ella." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "Un camino de línea discontinua va de izquierda a derecha y sigue adelante rodeando un obstáculo que hay en el centro. Debajo hay siete cuadraditos; la mayoría están rellenos, uno está vacío y junto al último hay un punto naranja.",
          caption: "El plan puede rodear el obstáculo. Que uno de los siete días quede vacío no significa que el camino se haya acabado.",
        },

        { id: "b3-h3", type: "h", text: "Saltarse un día" },
        { id: "b3-p6", type: "p", text: "Cuando estás probando un hábito nuevo, saltarte un día hace que mucha gente sienta que tiene que empezarlo todo de cero. Los contadores de rachas alimentan esa sensación: una cadena de treinta días vuelve a cero en un solo día." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "En un estudio realizado en Londres, 96 voluntarios eligieron una conducta relacionada con comer, beber o moverse para hacerla cada día en la misma situación, y durante 12 semanas valoraron ellos mismos, a diario, hasta qué punto se había vuelto automática. Perder una sola oportunidad no alteró de forma notable el proceso de formación del hábito. El tiempo que tardó la conducta en volverse casi automática varió mucho de una persona a otra: entre 18 y 254 días.",
          limits: "Un grupo pequeño de voluntarios y conductas diarias sencillas. La automaticidad se midió con la valoración de los propios participantes, y los datos de algunos de ellos no se ajustaron bien al modelo. Con conductas más complejas, los resultados podrían ser distintos.",
          details: "En el estudio, la mediana fue de 66 días; pero no es una media, ni tampoco una meta. El hallazgo sugiere que los plazos fijos del tipo “un hábito en 21 días” no sirven para todo el mundo y que saltarse un día de vez en cuando no reinicia el proceso.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "Cuando pruebes un hábito, haz primero una prueba corta de siete días. El objetivo no es adquirir el hábito en siete días, sino ver si el momento, el lugar y el paso que has elegido encajan contigo. Cambiar el plan al cabo de los siete días forma parte del experimento.",
        },

        { id: "b3-h5", type: "h", text: "Si el plan no encaja contigo" },
        { id: "b3-p10", type: "p", text: "A veces el problema no es un solo mal día. Si el mismo plan no sale varios días seguidos, puede que sea señal de que no es el plan el que se adapta a ti, sino tú quien intenta adaptarse al plan. Para alguien que planea salir a correr a las siete de la mañana pero apaga la alarma todos los días, la verdadera pregunta quizá no sea “¿Por qué no soy capaz?”, sino “¿De verdad me va bien esta hora?”." },
        { id: "b3-p11", type: "p", text: "Al cambiar el plan, puedes fijarte en tres cosas: el momento, el lugar y el tamaño del paso. Muchas veces basta con cambiar una. Por la tarde en vez de por la mañana, la biblioteca en vez de casa, diez minutos en vez de media hora. La meta puede seguir siendo la misma; solo cambia el camino para llegar a ella." },
        { id: "b3-p12", type: "p", text: "Mientras haces estos cambios, puede ayudarte mirarte como alguien que está llevando a cabo un experimento. Los experimentos no siempre dan el resultado esperado; eso no significa que quien los hace haya fracasado, solo indica qué hay que cambiar en el siguiente intento." },

        { id: "b3-h4", type: "h", text: "Dos preguntas por la noche" },
        { id: "b3-p7", type: "p", text: "Al final del día, en lugar de contar cuánto del plan se ha cumplido, prueba a hacerte dos preguntas: ¿Qué me ha funcionado hoy? ¿Qué puedo ponerme más fácil mañana? La primera te ayuda a fijarte en lo que funciona. La segunda corrige un poco el plan del día siguiente a partir de lo que has vivido hoy." },
        { id: "b3-p8", type: "p", text: "Las respuestas pueden ser pequeñas: “Me ha funcionado dejar el móvil en otra habitación”. “Mañana preparo la mochila la noche anterior”. Así es como los planes se adaptan a la vida: con pequeños ajustes, día a día." },
        { id: "b3-p9", type: "p", text: "Ese jueves por la noche, Lucía abrió el archivo del trabajo y escribió una sola frase para la segunda parte. Después se fue a dormir. A la mañana siguiente, al abrir el archivo, en lugar de una página en blanco la esperaba una frase." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "Una pequeña prueba de siete días",
          planner: "habit",
          steps: [
            "Elige un solo hábito que quieras probar.",
            "Escribe el comienzo más pequeño que sea factible: tan pequeño que puedas hacerlo incluso en un mal día.",
            "Vincúlalo a un momento que ya forme parte de tu día y decide dónde lo harás.",
            "Añade una opción más pequeña para los días difíciles.",
            "Durante siete días, cada noche marca solo esto: lo hice, hice la versión más pequeña o no lo hice. Después vuelve a mirar tu plan.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "Cuando el plan se tuerce, en lugar de abandonarlo, muchas veces puedes cambiarle el momento o reducir el paso; y saltarte un día tampoco significa que el camino se haya acabado.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Para terminar",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "En este libro había tres ideas pequeñas: dejar en algún sitio lo que tienes en la cabeza, elegir una sola tarea principal para hoy y su primer paso, y poder cambiar el plan cuando cambia el día." },
        { id: "k2", type: "p", text: "Ninguna de ellas hará que todos los días sean fáciles. Algunos días la lista seguirá siendo larga, la tarea principal no avanzará y la prueba se atascará. Eso no significa que el método haya fallado, ni que hayas fallado tú. Al día siguiente puedes volver a elegir una tarea principal." },
        { id: "k3", type: "p", text: "El planificador y Mi hábito siguen aquí cuando termines de leer el libro. Puedes abrirlos el día que quieras y escribir solo la tarea principal de hoy, o no abrirlos en absoluto. Tus registros se guardan solo en este dispositivo; no olvides hacer una copia de seguridad de vez en cuando." },
        { id: "k4", type: "p", text: "Los pasos pequeños no lo resuelven todo. Pero, casi todos los días, pueden bastar para empezar." },
      ],
    },
  ],
};
