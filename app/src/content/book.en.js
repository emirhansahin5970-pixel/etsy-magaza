/*
 * Book content (English): "Small Steps, Clear Days"
 * Translation of book.tr.js: same chapter and block ids; the bibliography lives only in book.tr.js.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.en = {
  lang: "en",
  title: "Small Steps, Clear Days",
  subtitle: "A short read and a gentle daily planner",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Getting started",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "This short book is for anyone trying to get through the day. For the person juggling classes, work, home and a phone that never stops buzzing, and who looks back in the evening and wonders, “What did I even do today?”" },
        { id: "g2", type: "p", text: "You won’t find a big system here. No color-coded planners, no twenty-step morning routines, no promise to change everything overnight. Just three small ideas: put what’s on your mind somewhere outside your head, choose one main task for today, and let your plan change when your day does." },
        { id: "g3", type: "p", text: "Each chapter is short enough to read on a bus ride. At the end of each one there’s an exercise that takes a few minutes. You can do it on paper or in the planner that comes with this app." },
        { id: "g4", type: "p", text: "Now and then I’ll mention research. I’d like you to read it not as “science has proven,” but as “this is what was seen with certain people, under certain conditions.” What the research says and what I suggest are kept in separate boxes. Knowing which is which makes it easier to decide what you want to bring into your own life." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "You Don’t Have to Keep It All in Your Head",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "8:10 a.m. Sam is standing by the doors on the subway, holding the rail with one hand and scrolling through email with the other.",
            "The thoughts don’t arrive in any order. The assignment due Friday. The message to the landlord about rent. The return package that needs to be dropped off. Mom’s birthday next week. The half-finished internship application. And last night Sam told a friend, “I’ll call you tomorrow.” When, exactly?",
            "As the train pulls into the station, a familiar feeling creeps in: I’m forgetting something, but what? The day hasn’t even started, and Sam is already tired.",
          ],
        },

        { id: "b1-h1", type: "h", text: "Your mind is a good reminder and a poor storage room" },
        { id: "b1-p1", type: "p", text: "Sam’s problem isn’t laziness or being disorganized. The problem is that every task is sitting in the same place at the same time: inside Sam’s head." },
        { id: "b1-p2", type: "p", text: "An unfinished task, as long as it isn’t written down somewhere, keeps reminding you of itself. The return package pops into your head during a lecture, the assignment while you’re eating. Sometimes these reminders help. But they don’t choose their order or their timing. An important task and a trivial one call out in the same voice." },
        { id: "b1-p3", type: "p", text: "You end up with twenty half-thoughts and can’t fully think through any of them. That may be one reason you can feel busy all day and still feel, by evening, like you got nothing done." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "In a series of experiments, participants who were reminded of an unfinished goal had their minds drift to that goal more often during an unrelated reading task. When they were allowed to make a specific plan for that same goal, the effect disappeared.",
          limits: "The experiments took place in a lab, mostly with university students. The results may not be the same for everyone in everyday life.",
          details: "According to the researchers, what made the difference was not simply remembering the task but making a concrete plan for it. In this book, writing things down is the first step; planning is the subject of the second chapter.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "What writing it down is actually for" },
        { id: "b1-p4", type: "p", text: "Writing down what’s on your mind isn’t a promise that you’ll do all of it. It’s more like parking it somewhere. When your car is in the parking lot, you don’t have to keep thinking about it; it’s enough to know where it is." },
        { id: "b1-p5", type: "p", text: "A list on paper does three practical things. First, it lets you compare tasks. In your head they all look the same size; once they’re written down, you notice that some take two minutes and others take two weeks. Second, it eases the worry about forgetting, because now the paper does the remembering. Third, it makes the next step easier: deciding what to pick for today." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "On the left, short lines and loops of different sizes tangled together; from the middle, an arrow leads to a sheet of paper on the right with neat lines. The paper has a few lines of writing and a small check mark next to one of them.",
          caption: "In your head, everything gets tangled together. On paper, the same tasks line up and can be compared.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "In a sleep lab study, young adults who spent five minutes before bed writing down what they had to do in the coming days fell asleep faster, on average, than those who wrote about what they had completed in the past few days.",
          limits: "A single night and a small group of 57 people without sleep problems. It doesn’t show that writing helps everyone sleep better.",
          details: "Those who wrote their to-do lists in more detail also fell asleep faster. This finding should be read as a hint that moving the list from your mind to paper may be calming, not as a firm conclusion.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "You don’t have to organize your whole life" },
        { id: "b1-p6", type: "p", text: "At this point, the first idea that comes up is usually a big cleanup: download a new app, sort everything into categories, add colors, tags, priority levels. A week later, the system has become one more thing that needs looking after." },
        { id: "b1-p7", type: "p", text: "There’s no need for that. The only thing you’ll do in this chapter is get what’s on your mind out of your head for a few minutes. No sorting, no ranking, no planning. We’ll get to that part in the second chapter, and even there we’ll choose one task, not twenty." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Keep the list in one place. If you write in your phone’s notes app one day, on a scrap of paper the next, and in a message draft the day after, your mind will just switch to trying to remember where the lists are. It doesn’t matter which place you choose; it matters that it’s the same place.",
        },

        { id: "b1-p8", type: "p", text: "It may also help to know this: your list is going to look messy. “Call Mom” will sit right above “Figure out what to do after graduation.” That’s normal. The list isn’t there to be tidy; it’s there to make the load in your head visible." },
        { id: "b1-h4", type: "h", text: "What if the list gets long?" },
        { id: "b1-p10", type: "p", text: "Many people who write everything down for the first time flinch a little when they look at the result. Fifteen, twenty lines. “I have this much to do?” But those tasks were already there; now they’re just countable." },
        { id: "b1-p11", type: "p", text: "A long list doesn’t mean you have to do it all today. Some lines are a single text message, some are things that will take months, and some aren’t really tasks at all but worries: “Will I ever find an internship?” You don’t need to do anything to separate them for now. Just seeing that they aren’t all the same kind of thing can lighten the load a little." },
        { id: "b1-p12", type: "p", text: "There may also be things that come to mind that you don’t want to write down. You don’t have to write everything. Nobody is going to see this list; it isn’t there to test you, just to free up a bit of room in your head." },
        { id: "b1-p13", type: "p", text: "You might also notice that some tasks shrink as soon as they’re written down. “Message the landlord” feels like a big conversation in your head, but on paper it turns into a two-sentence text. That doesn’t happen with every task, but when it does, it’s a relief." },
        { id: "b1-p9", type: "p", text: "After getting off the subway that morning, Sam spent three minutes typing everything that came to mind into the notes app. Fourteen lines. Sam didn’t do any of them right then. But after seeing the plan to call the friend at lunch and drop off the return package on the way home that evening, the rest got a little quieter." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "The three-minute brain dump",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Set a three-minute timer. You can also use the button below.",
            "Write down every task that comes to mind, short and in no particular order. Don’t sort big from small: “Rent message,” “Assignment,” “Dentist appointment.”",
            "Don’t write sentences that start with “I should…”; the name of the task is enough.",
            "Stop when the timer goes off. The list may be incomplete; anything missing can be added later.",
            "You don’t need to do anything with the list for now. Just know that it’s there.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Writing down what’s on your mind doesn’t mean you have to do it right away; it just means you can stop carrying it all at once.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Give Today One Main Task",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Tuesday, 10:00 a.m. Sam is in the library, at a table by the window. Yesterday’s list is right there: fourteen lines.",
            "First, Sam opens the assignment file. A few minutes later, the internship form’s deadline comes to mind, so Sam opens the form. While looking for a document the form asks for, Sam remembers to check the deadline for the package return. Then it’s back to the assignment.",
            "By late morning, seven tabs are open on the screen. None of them is finished. Sam knows the whole morning was spent working, but there’s nothing to show for it.",
          ],
        },

        { id: "b2-h1", type: "h", text: "A list is not a plan" },
        { id: "b2-p1", type: "p", text: "In the first chapter, you wrote down what was on your mind. That lightens the load in your head, but it doesn’t tell you what to start with today. A list is an inventory. Look at fourteen lines at once, and you may start to feel that each one is more urgent than the next." },
        { id: "b2-p2", type: "p", text: "That’s how Sam’s morning went, too. Every task was legitimate, every switch made sense. But each time Sam jumped between tasks, it meant having to remember where things had been left off. The day filled up with half-finished starts." },
        { id: "b2-p3", type: "p", text: "What I suggest in this chapter is simple: choose one main task for each day. It doesn’t have to be the most important thing in your life. Here’s the test: if this task were done, or had moved forward, by this evening, would you feel relieved? If the answer is yes, that’s today’s main task." },
        { id: "b2-p4", type: "p", text: "The other tasks don’t disappear; they wait on the list. Choosing a main task doesn’t mean giving up on the others. It means deciding that when you’ll look at them can wait until later." },

        { id: "b2-h5", type: "h", text: "When choosing feels hard" },
        { id: "b2-p12", type: "p", text: "Some mornings, two or three tasks seem equally urgent. On days like that, a few questions can make the choice easier. Which one has the closer deadline? Which one, if it doesn’t get done, will hold up other things too? Which one sits heavier on your chest when you think about it?" },
        { id: "b2-p13", type: "p", text: "These questions don’t always have a clear answer. In that case, even flipping a coin can be better than not choosing at all. Picking the “wrong” main task is often less tiring than bouncing between three tasks all day, because at least one of them moves forward." },
        { id: "b2-p14", type: "p", text: "And one more thing: the main task doesn’t have to be a big one every day. On a day when you’re tired, just out of an exam or sick, the main task might be “Do the laundry.” You choose the main task based on what the day can hold, not on what the person you want to be could handle." },

        { id: "b2-h2", type: "h", text: "Turning the main task into a small step" },
        { id: "b2-p5", type: "p", text: "“Write the paper” can be a good main task, but it’s a bad starting point. It’s too big; you don’t know where to grab hold of it. What makes starting easier is the main task’s first small step: an action concrete enough to do in a few minutes." },
        { id: "b2-p6", type: "p", text: "A few examples: instead of “Write the paper,” try “Open the file and write three headings.” Instead of “Internship application,” try “Find the missing document and put it in the folder.” Instead of “Talk to the landlord,” try “Write the first sentence of the rent message.”" },
        { id: "b2-p7", type: "p", text: "The point of the first step isn’t to finish the task, it’s to get into it. Sometimes you keep going after the first step, and sometimes you don’t. Either is fine. But there’s a difference between waiting in front of a blank page and coming back to a page that already has three headings." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "On the left, a large box with a few lines inside it; an arrow leads to four small steps rising to the right. There is an orange dot on the first and lowest step.",
          caption: "You can’t clear a big task in one leap. The first step should be low enough to take today.",
        },

        { id: "b2-h3", type: "h", text: "When and where?" },
        { id: "b2-p8", type: "p", text: "Once you’ve chosen the first step, one more question remains: when and where will you do it? “Sometime today” often slips to the end of the day. “After lunch, on the top floor of the library” sits in your mind like an appointment." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "Plans that psychologist Peter Gollwitzer calls “implementation intentions” involve deciding in advance when, where and how you will act on a goal: “When situation X arises, I will do Y.” In a meta-analysis that brought together 94 independent tests, participants who made plans like this reached their goals at a noticeably higher rate, on average, than those who only set goals.",
          limits: "The size of the effect varied between studies, and some of the research was done in the lab or with students. An average effect doesn’t show that planning will work for everyone or for every task.",
          details: "According to the researchers, plans like these make it easier to start when the moment comes, because the “When should I start?” decision has already been made. In this book, the “Set my start time” section in My Day is based on this idea.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Instead of tying the time to the clock, try tying it to a moment that already happens in your day: “After my first class,” “Once I’ve poured my coffee,” “When I get home and drop my bag.” Clock times slip; moments like these still come around on most days.",
        },

        { id: "b2-h4", type: "h", text: "Extra tasks and what carries over to tomorrow" },
        { id: "b2-p9", type: "p", text: "Alongside the main task, there will also be small things that need doing during the day. In My Day, there are only two spots for these. That may look like a restriction; it’s really a gauge. If you need more than two lines, today may already be a full day, and it’s natural for some tasks to carry over to tomorrow." },
        { id: "b2-p10", type: "p", text: "A task that carries over to tomorrow isn’t a failure; it’s a decision. Keeping it on the list means it hasn’t been forgotten." },
        { id: "b2-p11", type: "p", text: "That day after lunch, Sam closed all the tabs. The main task was the assignment; the first step was to open the file and write three headings. Sam sat down at an empty table upstairs. The headings took ten minutes. Then Sam wrote a few more paragraphs under the first heading. The internship form and the package became the next day’s extra tasks." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "Today’s main task",
          planner: "main",
          steps: [
            "Look at your list and ask yourself: which one, if it moved forward, would let me feel relieved this evening?",
            "Write that task down as today’s main task.",
            "Below it, write the first small step you could start in a few minutes.",
            "If you like, add when and where you’ll start, for example: “After lunch, at my desk.”",
            "The rest of the tasks can wait on the list. For today, this is enough.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "One main task for today and a small first step toward it is often easier than trying to get started by staring at a long list.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Fit Your Plan to Your Life",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Thursday. Sam’s plan was clear: after lunch, the second section of the assignment, at the library.",
            "But the group meeting ran long. On the way out, it started to rain. By the time Sam got home, it was past six: wet, tired and a little annoyed.",
            "The thought that came up was a familiar one: “Today’s already ruined. I’ll start fresh tomorrow.”",
          ],
        },

        { id: "b3-h1", type: "h", text: "When the plan falls apart" },
        { id: "b3-p1", type: "p", text: "A plan made in the morning is a guess about how the day will go. Meetings run long, buses are late, energy runs out sooner than expected. A plan not working out isn’t a mistake on the part of the person who made it; that’s just the nature of guesses." },
        { id: "b3-p2", type: "p", text: "The problem is often not the broken plan but the “all or nothing” thinking that follows. If the plan can’t be carried out exactly, it feels as if it can’t be carried out at all. But on most days, there are three options." },
        { id: "b3-p3", type: "p", text: "The first is to shift the time: “The afternoon didn’t work, so half an hour after dinner.” The second is to shrink the step: “I can’t write the second section, but I can read through my notes once.” The third is to postpone on purpose: “I’m not doing it today; it’s the first thing tomorrow morning.” All three are decisions. The day that gets lost is the day no decision is made." },

        { id: "b3-h2", type: "h", text: "A smaller option for hard days" },
        { id: "b3-p4", type: "p", text: "On a day that’s going well, the first step is easy. A plan is really tested on the hard days. That’s why it can help to decide on a “smaller option” in advance: a backup small enough that you can do it even on a bad day." },
        { id: "b3-p5", type: "p", text: "For an assignment, that might be opening the file and writing a single sentence. For walking, stepping outside and strolling around the block for five minutes. For reading, one page. The smaller option isn’t there so the task counts as done; it’s there so you don’t lose touch with it." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "A dashed path running from left to right curves around an obstacle in the middle and continues. Below are seven small squares; most are filled, one is empty, and there is an orange dot next to the last one.",
          caption: "A plan can go around an obstacle. A gap on one of seven days doesn’t mean the road has ended.",
        },

        { id: "b3-h3", type: "h", text: "Missing a day" },
        { id: "b3-p6", type: "p", text: "When you’re trying out a new habit, skipping a day feels to many people as if they have to start all over again. Streak counters feed that feeling: a thirty-day chain resets in a single day." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "In a study in London, 96 volunteers each chose an eating, drinking or activity behavior to do in the same situation every day, and for 12 weeks rated each day for themselves how automatic that behavior had become. Missing a single opportunity did not noticeably disrupt the habit-forming process. How long it took for the behavior to become nearly automatic varied widely from person to person: between 18 and 254 days.",
          limits: "A small group of volunteers and simple daily behaviors. Automaticity was measured by the participants’ own ratings, and some participants’ data did not fit the model well. Results may be different for more complex behaviors.",
          details: "The median time in the study was 66 days, but this is neither an average nor a target. The finding suggests that fixed timeframes like “a habit in 21 days” don’t fit everyone, and that occasionally missing a day doesn’t reset the process.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "When you try out a habit, start with a short seven-day trial. The goal isn’t to build the habit in seven days; it’s to see whether the time, place and step you chose actually suit you. Changing the plan at the end of the seven days is part of the experiment.",
        },

        { id: "b3-h5", type: "h", text: "If the plan doesn’t fit you" },
        { id: "b3-p10", type: "p", text: "Sometimes the problem isn’t a single bad day. If the same plan keeps not working several days in a row, it may be a sign that you’re trying to fit the plan rather than the plan fitting you. For someone who plans to run at 7 a.m. but switches off the alarm every morning, the real question may not be “Why can’t I do this?” but “Does this time actually work for me?”" },
        { id: "b3-p11", type: "p", text: "When you change a plan, you can look at three things: the time, the place and the size of the step. Changing just one is often enough. Evening instead of morning, the library instead of home, ten minutes instead of half an hour. The goal can stay the same; only the path to it changes." },
        { id: "b3-p12", type: "p", text: "While you make these changes, it can help to see yourself as someone running an experiment. Experiments don’t always give the expected result; that doesn’t mean the person running them has failed, it just shows what to change in the next attempt." },

        { id: "b3-h4", type: "h", text: "Two questions in the evening" },
        { id: "b3-p7", type: "p", text: "At the end of the day, instead of counting how much of your plan actually happened, try asking two questions: What worked today? What could I make easier tomorrow? The first helps you notice what’s working. The second adjusts tomorrow’s plan a little, based on today’s experience." },
        { id: "b3-p8", type: "p", text: "The answers can be small: “Putting my phone in another room helped.” “I’ll pack my bag the night before.” This is how plans come to fit your life: through small adjustments, day by day." },
        { id: "b3-p9", type: "p", text: "That Thursday evening, Sam opened the assignment file and wrote a single sentence for the second section. Then Sam went to bed. The next morning, when Sam opened the file, there was a sentence waiting instead of a blank page." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "A small seven-day trial",
          planner: "habit",
          steps: [
            "Choose one habit you’d like to try.",
            "Write down the smallest workable way to start: small enough that you could do it even on a bad day.",
            "Tie it to a moment that already happens in your day, and decide where you’ll do it.",
            "Add a smaller option for hard days.",
            "For seven days, each evening, just mark one of these: I did it, I did a smaller version, or I didn’t do it. Then take another look at your plan.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "When a plan falls apart, instead of dropping it, you can often shift its time or shrink its step; and missing a day doesn’t mean the road has ended.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Closing",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "This book had three small ideas: put what’s on your mind somewhere outside your head, choose one main task for today along with its first step, and let your plan change when your day does." },
        { id: "k2", type: "p", text: "None of these will make every day easy. Some days the list will stay long, the main task won’t move, the trial will stumble. That doesn’t mean the method has failed, or that you have. Tomorrow, you can choose a main task again." },
        { id: "k3", type: "p", text: "The planner and the habit section are still here after you finish the book. Some days you might open them just to write down today’s main task; other days you might not open them at all. Your entries are stored only on this device, so remember to make a backup now and then." },
        { id: "k4", type: "p", text: "Small steps don’t solve everything. But on most days, they can be enough to get started." },
      ],
    },
  ],
};
