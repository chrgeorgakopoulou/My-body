export type Language = 'el' | 'en';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  ageBadge: string;
  torsoTab: string;
  headTab: string;
  testModeActive: string;
  testModeBtn: string;
  testModeTitle: string;
  quizBtn: string;
  quizTitle: string;
  helpBtn: string;
  helpTitle: string;
  soundMuteTitle: string;
  soundUnmuteTitle: string;
  langToggleTitle: string;

  // Diagram Viewer
  hiddenLabel: string;
  clickOrganPrompt: string;

  // Organ Card
  realAnatomyBadge: string;
  roleLabel: string;
  howItWorksLabel: string;
  funFactLabel: string;
  kidAdviceLabel: string;
  readToMe: string;
  stopReading: string;
  normalSpeed: string;
  slowSpeed: string;
  closeCard: string;
  minimizeCard: string;
  expandCard: string;
  heartbeatSound: string;
  breathingSound: string;
  brainSound: string;
  soundButton: string;
  systemLabel: string;

  // Quiz
  quizHeading: string;
  quizSubheading: string;
  questionOf: (current: number, total: number) => string;
  currentScore: (score: number) => string;
  hintButton: string;
  nextQuestion: string;
  finishQuiz: string;
  tryAgain: string;
  backToExplorer: string;
  quizCompleted: string;
  perfectResult: string;
  greatResult: string;
  goodResult: string;
  correctAnswerMsg: string;
  wrongAnswerMsg: string;

  // Help Modal
  helpHeading: string;
  helpSubheading: string;
  helpTip1Title: string;
  helpTip1Desc: string;
  helpTip2Title: string;
  helpTip2Desc: string;
  helpTip3Title: string;
  helpTip3Desc: string;
  helpTip4Title: string;
  helpTip4Desc: string;
  helpTip5Title: string;
  helpTip5Desc: string;
  closeButton: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  el: {
    appTitle: 'BioExplorer',
    appSubtitle: 'Το Ανθρώπινο Σώμα & το Κεφάλι',
    ageBadge: '10 Ετών',
    torsoTab: 'Σώμα & Όργανα',
    headTab: 'Διατομή Κεφαλιού',
    testModeActive: 'Εξέταση (Ενεργή)',
    testModeBtn: 'Κρύψε Ετικέτες',
    testModeTitle: 'Κρύψε τις ετικέτες για να δοκιμάσεις τις γνώσεις σου!',
    quizBtn: 'Κουίζ',
    quizTitle: 'Παίξε το διασκεδαστικό κουίζ ανατομίας!',
    helpBtn: 'Οδηγίες',
    helpTitle: 'Οδηγίες χρήσης για μαθητές',
    soundMuteTitle: 'Σίγαση ήχου',
    soundUnmuteTitle: 'Ενεργοποίηση ήχου',
    langToggleTitle: 'Switch to English / Αλλαγή σε Αγγλικά',

    hiddenLabel: 'Ποιο είναι; (❓)',
    clickOrganPrompt: 'Κάνε κλικ σε ένα όργανο ή ετικέτα για να το εξερευνήσεις!',

    realAnatomyBadge: 'Πραγματική Ανατομία',
    roleLabel: 'Ποια είναι η λειτουργία του;',
    howItWorksLabel: 'Πώς λειτουργεί;',
    funFactLabel: 'Ήξερες ότι...;',
    kidAdviceLabel: 'Συμβουλή για γερό σώμα:',
    readToMe: '🔊 Διαβάστε μου!',
    stopReading: 'Διακοπή Ομιλίας',
    normalSpeed: '1.0x',
    slowSpeed: '0.8x (Αργά)',
    closeCard: 'Κλείσιμο',
    minimizeCard: 'Ελαχιστοποίηση',
    expandCard: 'Αναλυτικά',
    heartbeatSound: 'Χτύπος ❤️',
    breathingSound: 'Αναπνοή 🫁',
    brainSound: 'Σκέψη 🧠',
    soundButton: 'Ήχος 🎵',
    systemLabel: 'Σύστημα',

    quizHeading: 'Κουίζ Ανατομίας',
    quizSubheading: 'Βρες το σωστό όργανο!',
    questionOf: (current, total) => `Ερώτηση ${current} από ${total}`,
    currentScore: (score) => `Βαθμολογία: ${score}`,
    hintButton: '💡 Βοήθεια (Hint)',
    nextQuestion: 'Επόμενη Ερώτηση',
    finishQuiz: 'Ολοκλήρωση',
    tryAgain: 'Παίξε Ξανά',
    backToExplorer: 'Πίσω στην Εξερεύνηση',
    quizCompleted: 'Συγχαρητήρια! Ολοκλήρωσες το Κουίζ!',
    perfectResult: '🌟 Άριστα! Είσαι ένας αληθινός μικρός γιατρός!',
    greatResult: '👏 Πολύ καλά! Γνωρίζεις εξαιρετικά το σώμα σου!',
    goodResult: '👍 Καλή προσπάθεια! Εξερεύνησε ξανά τα όργανα για να γίνεις τέλειος!',
    correctAnswerMsg: 'Σωστά! Μπράβο!',
    wrongAnswerMsg: 'Όχι ακριβώς, αλλά μην ανησυχείς!',

    helpHeading: 'Οδηγίες Χρήσης για Μαθητές',
    helpSubheading: 'Πώς να εξερευνήσεις το Σώμα & το Κεφάλι',
    helpTip1Title: 'Επιλογή Σώματος ή Κεφαλιού:',
    helpTip1Desc: 'Πάτησε τα κουμπιά στο επάνω μέρος για να διαλέξεις ανάμεσα στο «Σώμα & Όργανα» και στη «Διατομή Κεφαλιού».',
    helpTip2Title: 'Κλικ σε Όργανο ή Ετικέτα:',
    helpTip2Desc: 'Πάτησε πάνω σε οποιοδήποτε όργανο ή στην ετικέτα του για να δεις τη λειτουργία του, πώς λειτουργεί και διασκεδαστικές πληροφορίες!',
    helpTip3Title: 'Φωνητική Ανάγνωση («Διαβάστε μου!»):',
    helpTip3Desc: 'Πάτησε το κουμπί του ήχου για να ακούσεις την περιγραφή φωναχτά. Μπορείς να διαλέξεις και πιο αργή ανάγνωση (0.8x).',
    helpTip4Title: 'Φυσικοί Ήχοι Σώματος:',
    helpTip4Desc: 'Άκουσε τον πραγματικό χτύπο της καρδιάς, την ανάσα των πνευμόνων και τους ήχους της πέψης!',
    helpTip5Title: 'Κουίζ & Λειτουργία Εξέτασης:',
    helpTip5Desc: 'Κρύψε τις ετικέτες για να δοκιμάσεις τη μνήμη σου ή παίξε το παιχνίδι Κουίζ για να κερδίσεις πόντους και κομφετί!',
    closeButton: 'Κατάλαβα, πάμε!',
  },

  en: {
    appTitle: 'BioExplorer',
    appSubtitle: 'The Human Body & Head Anatomy',
    ageBadge: 'Age 10',
    torsoTab: 'Torso & Organs',
    headTab: 'Head Cross-Section',
    testModeActive: 'Test Mode (Active)',
    testModeBtn: 'Hide Labels',
    testModeTitle: 'Hide the labels to test your memory and anatomy knowledge!',
    quizBtn: 'Quiz Game',
    quizTitle: 'Play the fun anatomy quiz game!',
    helpBtn: 'Instructions',
    helpTitle: 'User instructions for students',
    soundMuteTitle: 'Mute audio',
    soundUnmuteTitle: 'Unmute audio',
    langToggleTitle: 'Αλλαγή σε Ελληνικά / Switch to Greek',

    hiddenLabel: 'Which organ? (❓)',
    clickOrganPrompt: 'Click any organ or label to explore its function!',

    realAnatomyBadge: 'Real Anatomy',
    roleLabel: 'What is its role & function?',
    howItWorksLabel: 'How does it work?',
    funFactLabel: 'Did you know...?',
    kidAdviceLabel: 'Tip for a healthy body:',
    readToMe: '🔊 Read to me!',
    stopReading: 'Stop Reading',
    normalSpeed: '1.0x',
    slowSpeed: '0.8x (Slow)',
    closeCard: 'Close',
    minimizeCard: 'Minimize',
    expandCard: 'Details',
    heartbeatSound: 'Heartbeat ❤️',
    breathingSound: 'Breathing 🫁',
    brainSound: 'Brainwaves 🧠',
    soundButton: 'Sound 🎵',
    systemLabel: 'System',

    quizHeading: 'Anatomy Quiz',
    quizSubheading: 'Find the correct organ!',
    questionOf: (current, total) => `Question ${current} of ${total}`,
    currentScore: (score) => `Score: ${score}`,
    hintButton: '💡 Show Hint',
    nextQuestion: 'Next Question',
    finishQuiz: 'Finish Quiz',
    tryAgain: 'Play Again',
    backToExplorer: 'Back to Explorer',
    quizCompleted: 'Congratulations! You Completed the Quiz!',
    perfectResult: '🌟 Perfect score! You are a brilliant junior doctor!',
    greatResult: '👏 Great job! You know your body very well!',
    goodResult: '👍 Good effort! Explore the organs again to score 100%!',
    correctAnswerMsg: 'Correct! Awesome job!',
    wrongAnswerMsg: 'Not quite, but keep learning!',

    helpHeading: 'Student User Guide',
    helpSubheading: 'How to explore the Human Body and Head Anatomy',
    helpTip1Title: 'Select Torso or Head Cross-Section:',
    helpTip1Desc: 'Use the top switcher buttons to choose between the "Torso & Organs" and the "Head Cross-Section".',
    helpTip2Title: 'Click Any Organ or Label:',
    helpTip2Desc: 'Click on any organ dot or label to discover its role, how it works, and fun facts curated for 10-year-olds!',
    helpTip3Title: 'Voice Narration ("Read to me!"):',
    helpTip3Desc: 'Click the audio button to hear the explanation read out loud in natural English. You can also pick a slower reading speed (0.8x).',
    helpTip4Title: 'Real Body Sounds:',
    helpTip4Desc: 'Hear the authentic rhythm of the heartbeat, deep breathing in the lungs, and digestive sounds!',
    helpTip5Title: 'Quiz & Test Mode:',
    helpTip5Desc: 'Hide labels to quiz your memory, or launch the Quiz Game to test your knowledge and celebrate with confetti!',
    closeButton: 'Got it, let’s explore!',
  },
};
