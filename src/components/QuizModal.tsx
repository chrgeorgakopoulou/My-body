import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Volume2, X, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../types/anatomy';
import { soundEngine } from '../audio/soundEffects';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface QuizModalProps {
  onClose: () => void;
  onFocusOrgan: (organId: string) => void;
  lang: Language;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose, onFocusOrgan, lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentIdx];

  const questionText = isEn ? currentQuestion.questionEn : currentQuestion.question;
  const hintText = isEn ? currentQuestion.hintEn : currentQuestion.hint;
  const explanationText = isEn ? currentQuestion.explanationEn : currentQuestion.explanation;

  const handleSelectOption = (organId: string) => {
    if (showResult) return;
    setSelectedOption(organId);
    setShowResult(true);

    const isCorrect = organId === currentQuestion.correctOrganId;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      soundEngine.playSuccess();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      soundEngine.playClick();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setIsCompleted(false);
  };

  const readQuestion = () => {
    const optionsText = currentQuestion.options.map((o) => (isEn ? o.labelEn : o.label)).join(', ');
    const textToRead = isEn
      ? `${questionText}. Options: ${optionsText}`
      : `${questionText}. Επιλογές: ${optionsText}`;
    soundEngine.speakText(textToRead, { lang });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600/30 to-blue-600/20 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xl">
              🎯
            </span>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                {t.quizHeading}
              </h2>
              <span className="text-xs text-cyan-300 font-semibold">
                {t.quizSubheading}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.stopSpeech();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {!isCompleted ? (
            <>
              {/* Progress and score */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-1">
                <span>{t.questionOf(currentIdx + 1, QUIZ_QUESTIONS.length)}</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⭐ {t.currentScore(score)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {questionText}
                  </h3>
                  <button
                    onClick={readQuestion}
                    className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors shrink-0"
                    title={isEn ? 'Read question aloud' : 'Ανάγνωση ερώτησης φωναχτά'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hint Button */}
                {!showResult && (
                  <div>
                    {!showHint ? (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>{t.hintButton}</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs sm:text-sm animate-in fade-in">
                        💡 <strong>{isEn ? 'Hint:' : 'Βοήθεια:'}</strong> {hintText}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.organId;
                  const isCorrect = option.organId === currentQuestion.correctOrganId;
                  const optionLabel = isEn ? option.labelEn : option.label;

                  let btnStyle = 'bg-slate-800 hover:bg-slate-700/80 text-white border-slate-700';

                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600/40 border-emerald-500 text-emerald-200 shadow-md font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-600/40 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-800/50 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={option.organId}
                      onClick={() => handleSelectOption(option.organId)}
                      disabled={showResult}
                      className={`p-3.5 rounded-2xl border text-left text-sm sm:text-base font-semibold flex items-center justify-between gap-2 transition-all ${btnStyle}`}
                    >
                      <span>{optionLabel}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {showResult && (
                <div
                  className={`p-4 rounded-2xl border animate-in fade-in ${
                    selectedOption === currentQuestion.correctOrganId
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">
                    {explanationText}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onFocusOrgan(currentQuestion.correctOrganId);
                        onClose();
                      }}
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Focus this organ in diagram' : 'Δες το όργανο στο σώμα!'}</span>
                    </button>

                    <button
                      onClick={handleNext}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                    >
                      <span>
                        {currentIdx < QUIZ_QUESTIONS.length - 1 ? t.nextQuestion : t.finishQuiz}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl shadow-xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">
                {t.quizCompleted}
              </h3>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                {score === QUIZ_QUESTIONS.length
                  ? t.perfectResult
                  : score >= QUIZ_QUESTIONS.length - 2
                  ? t.greatResult
                  : t.goodResult}
              </p>
              <div className="text-amber-400 font-bold text-lg">
                {t.currentScore(score)} / {QUIZ_QUESTIONS.length}
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.tryAgain}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg"
                >
                  <span>{t.backToExplorer}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
