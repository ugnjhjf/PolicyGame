import { DialogueOverlay } from '../vn/DialogueOverlay'
import { PDAOverlay } from '../pda/PDAOverlay'
import { PDANotification } from '../pda/PDANotification'
import { InvestigationReportOverlay } from '../pda/InvestigationReportOverlay'
import { SolutionMatchingOverlay } from '../minigame/SolutionMatchingOverlay'
import { LoanApprovalGameOverlay } from '../minigame/LoanApprovalGameOverlay'
import { ChapterCompletionOverlay, ChapterMasteryOverlay, QuizOverlay } from './'
import { OfficerChanQuizOverlay } from './OfficerChanQuizOverlay'
import quizData from '../../config/data/quiz/quiz.json'
import officerChanQuizData from '../../config/data/quiz/officer_chan_quiz.json'
import { useGameState } from '../../hooks/useGameState'
import type { InvestigationReportData } from '@/types/rpg'

interface GameOverlaysProps {
  state: ReturnType<typeof useGameState>
}

export function GameOverlays({ state }: GameOverlaysProps) {
  const {
    showDialogue, dialogueContent, handleDialogueNext,
    showPDA, pdaTab, pdaSelectedId, rpgState, handleMarkAsRead,
    showReport, reportData, handleReportClose, handleReportNavigate,
    showSolutionGame, solutionPlacements, setSolutionPlacements, handleSolutionComplete,
    showLoanGame, handleLoanGameComplete,
    showChapterCompletion, setShowChapterCompletion, setShowQuiz,
    showQuiz, setChallengeStatus, setShowMasteryOverlay,
    showMasteryOverlay, challengeStatus,
    notification, showNotification, handleNotificationClose,
    setReportData, setShowReport, setShowPDA, setPdaSelectedId,
    showOfficerChanQuiz, setShowOfficerChanQuiz
  } = state

  return (
    <>
      <DialogueOverlay
        isOpen={showDialogue}
        characterName={dialogueContent.name}
        characterImage={dialogueContent.image}
        text={dialogueContent.text}
        onNext={handleDialogueNext}
      />

      <PDAOverlay
        isOpen={showPDA}
        onClose={() => setShowPDA(false)}
        activeTab={pdaTab}
        concepts={rpgState.player.encyclopedia}
        clues={rpgState.player.journal}
        reports={rpgState.player.reports}
        onReportSelect={(report) => {
          setReportData(report)
          setShowReport(true)
          setShowPDA(false)
        }}
        onMarkAsRead={handleMarkAsRead}
        activeItemId={pdaSelectedId}
      />

      <InvestigationReportOverlay
        isOpen={showReport}
        onClose={handleReportClose}
        data={reportData}
        onNext={() => handleReportNavigate('next')}
        onPrev={() => handleReportNavigate('prev')}
        hasNext={!!(reportData && rpgState.player.reports.findIndex(r => r.fileId === reportData.fileId) < rpgState.player.reports.length - 1)}
        hasPrev={!!(reportData && rpgState.player.reports.findIndex(r => r.fileId === reportData.fileId) > 0)}
      />

      <SolutionMatchingOverlay
        isOpen={showSolutionGame}
        onClose={() => state.setShowSolutionGame?.(false)}
        initialPlacements={solutionPlacements}
        onSaveState={setSolutionPlacements}
        onComplete={handleSolutionComplete}
      />

      <LoanApprovalGameOverlay
        isOpen={showLoanGame}
        onClose={() => state.setShowLoanGame?.(false)}
        onComplete={handleLoanGameComplete}
      />

      <ChapterCompletionOverlay
        isOpen={showChapterCompletion}
        onNext={() => {
          setShowChapterCompletion(false)
          setShowQuiz(true)
        }}
      />

      <QuizOverlay
        isOpen={showQuiz}
        questions={quizData.questions}
        onComplete={(score: number, total: number) => {
          setShowQuiz(false)
          setChallengeStatus((prev: any) => ({ ...prev, quizHunter: score === total }))
          setShowMasteryOverlay(true)
        }}
      />

      <ChapterMasteryOverlay
        isOpen={showMasteryOverlay}
        onClose={() => setShowMasteryOverlay(false)}
        challenges={challengeStatus}
      />

      <OfficerChanQuizOverlay
        isOpen={showOfficerChanQuiz}
        questions={officerChanQuizData.questions}
        onComplete={() => setShowOfficerChanQuiz(false)}
      />

      {notification && (
        <PDANotification
          isVisible={showNotification}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
          onClick={notification.onClick}
        />
      )}
    </>
  )
}
