"use client";

import jsPDF from "jspdf";

interface PDFExportButtonProps {
  attempt: any;
  questions: any[];
}

export default function PDFExportButton({ attempt, questions }: PDFExportButtonProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(attempt.quizTitle, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Completed: ${new Date(attempt.completedAt).toLocaleString()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Performance Summary", 15, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const stats = [
      `Score: ${attempt.score}/${attempt.totalQuestions} (${attempt.percentageScore.toFixed(1)}%)`,
      `Rank: #${attempt.rank} out of ${attempt.totalParticipants} participants`,
      `Time Spent: ${Math.floor(attempt.timeSpent / 60)}m ${attempt.timeSpent % 60}s`
    ];

    stats.forEach(stat => {
      doc.text(stat, 15, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    questions.forEach((question, idx) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const questionText = `${idx + 1}. ${question.question}`;
      const questionLines = doc.splitTextToSize(questionText, pageWidth - 30);
      doc.text(questionLines, 15, yPosition);
      yPosition += questionLines.length * 6 + 4;

      doc.setFontSize(10);
      question.choices.forEach((choice: string, choiceIdx: number) => {
        const isCorrect = question.correct_answer === choiceIdx;
        const isUserAnswer = attempt.answers[idx]?.userAnswer === choiceIdx;

        if (isCorrect) {
          doc.setFillColor(200, 255, 200); 
          const choiceLines = doc.splitTextToSize(choice, pageWidth - 35);
          const highlightHeight = choiceLines.length * 5 + 1;
          doc.rect(18, yPosition - 4, pageWidth - 36, highlightHeight, "F");
        } else if (isUserAnswer && !isCorrect) {
          doc.setFillColor(255, 200, 200); 
          const choiceLines = doc.splitTextToSize(choice, pageWidth - 35);
          const highlightHeight = choiceLines.length * 5 + 1;
          doc.rect(18, yPosition - 4, pageWidth - 36, highlightHeight, "F");
        }

        doc.setFont("helvetica", isCorrect || isUserAnswer ? "bold" : "normal");
        doc.setTextColor(0, 0, 0); 

        const choiceText = choice;
        const choiceLines = doc.splitTextToSize(choiceText, pageWidth - 35);
        doc.text(choiceLines, 20, yPosition);
        yPosition += choiceLines.length * 5 + 2;
      });

      yPosition += 8;
    });

    doc.save(`${attempt.quizTitle.replace(/\s+/g, '_')}_Report.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
    >
      📄 Export PDF
    </button>
  );
}