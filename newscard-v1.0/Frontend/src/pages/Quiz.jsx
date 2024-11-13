import React, { useState, useEffect } from 'react';
import '../styles/quiz.css';

const Quiz = () => {
  const [quizState, setQuizState] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [widthValues, setWidthValue] = useState(0);
  const [questions] = useState([
    {
      numb: 1,
      question: 'What does HTML stand for?',
      answer: 'Hyper Text Markup Language',
      options: [
        'Hyper Text Preprocessor',
        'Hyper Text Markup Language',
        'Hyper Text Multiple Language',
        'Hyper Tool Multi Language',
      ],
    },
    {
      numb: 2,
      question: 'What does CSS stand for?',
      answer: 'Cascading Style Sheet',
      options: [
        'Common Style Sheet',
        'Colorful Style Sheet',
        'Computer Style Sheet',
        'Cascading Style Sheet',
      ],
    },
    {
      numb: 3,
      question: 'What does PHP stand for?',
      answer: 'Hypertext Preprocessor',
      options: [
        'Hypertext Preprocessor',
        'Hypertext Programming',
        'Hypertext Preprogramming',
        'Hometext Preprocessor',
      ],
    },
    {
      numb: 4,
      question: 'What does SQL stand for?',
      answer: 'Structured Query Language',
      options: [
        'Stylish Question Language',
        'Stylesheet Query Language',
        'Statement Question Language',
        'Structured Query Language',
      ],
    },
    {
      numb: 5,
      question: 'What does XML stand for?',
      answer: 'eXtensible Markup Language',
      options: [
        'eXtensible Markup Language',
        'eXecutable Multiple Language',
        'eXTra Multi-Program Language',
        'eXamine Multiple Language',
      ],
    },

    {
      numb: 6,
      question: 'Your Question is Here',

      options: ['Option 1', 'option 2', 'option 3', 'option 4'],
    },
  ]);
  const [isInfoActive, setIsInfoAtive] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isResultActive, setIsResultActive] = useState(false);
  const [quesCounter, setQuesCounter] = useState(0);
  const [timeCount, setTimeCount] = useState(15);
  const [showTimeOff, setShowTimeOff] = useState(false);
  const [showTickIcon, setShowTickIcon] = useState(false);
  const [showCrossIcon, setShowCrossIcon] = useState(false);
  const [correctOptionIndex, setCoorectOptionIndex] = useState(null);
  const [incorrectOptionIndex, setInoorectOptionIndex] = useState(null);
  const [disableOption, setDisableOption] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [timeLineWidth, setTimeLineWidth] = useState(0);
  const [counter, setCounter] = useState(null); // Store the timer interval
  const [counterLine, setCounterLine] = useState(null);
  let [scoreText, setScoreText] = useState('');

  let timeValue = 15;
  let widthValue = 0;
  useEffect(() => {
    return () => {
      if (counter) {
        clearInterval(counter);
      }
      if (counterLine) {
        clearInterval(counterLine);
      }
    };
  }, [counter, counterLine]);

  const showQuestion = (index) => {
    console.log('index', index);
    if (index < questions.length) {
      setQuestionIndex(index);
      setTimer(15);
      setWidthValue(0);
    } else {
      setQuizState('result');
    }
  };

  const quitQuiz = () => {
    window.location.reload();
  };

  const restartQuiz = () => {
    setIsQuizActive(true); //show quiz box
    setIsResultActive(false); //hide result box
    timeValue = 15;

    setScore(0);
    widthValue = 0;
    showQuestion(0); //calling showQestions function
    setQuesCounter(1); //passing 1 parameter to queCounter
    startTimer(15, 0); //calling startTimer function
    startTimerLine(0); //calling startTimerLine function
    if (counter) {
      clearInterval(counter);
    }
    if (counterLine) {
      clearInterval(counterLine);
    } //clear counterLine
    setShowTimeOff(false); //change the text of timeText to Time Left
    setShowNextBtn(false); //hide the next button
  };

  function showResult() {
    setIsInfoAtive(false); //hide info box
    setIsQuizActive(false); //hide quiz box
    setIsResultActive(true); //show result box
    let scoreT = '';
    if (score > 3) {
      // if user scored more than 3
      //creating a new span tag and passing the user score number and total question number
      scoreT = `<span>and congrats! 🎉, You got <p>${score}</p> out of <p> ${questions.length} </p></span>`;
      setScoreText(scoreT);
      //adding new span tag inside score_Text
    } else if (score > 1) {
      // if user scored more than 1
      scoreT = `<span>and nice 😎, You got <p> ${score} </p> out of <p> ${questions.length} </p></span>`;
      setScoreText(scoreT);
    } else {
      // if user scored less than 1
      scoreT = `<span>and sorry 😐, You got only <p>${score}</p> out of <p> ${questions.length}</p></span>`;
      setScoreText(scoreT);
    }
  }

  function startTimerLine(time) {
    setCounterLine(setInterval(timer, 29));
    function timer() {
      time += 1; //upgrading time value with 1
      //increasing width of time_line with px by time value
      if (time <= 549) {
        //if time value is greater than 549
        setTimeLineWidth(time);
      } else {
        if (counterLine) {
          clearInterval(counterLine);
        } //clear counterLine
      }
    }
  }
  function startTimer(time, questionIndex) {
    setCounter(setInterval(timer, 1000));
    function timer() {
      setTimeCount(time); //changing the value of timeCount with time value
      time--; //decrement the time value
      if (time <= 9 && time > 0) {
        //if timer is less than 9
        let addZero = time;
        let timeWithZero = '0' + addZero;
        setTimeCount(timeWithZero); //add a 0 before time value
      }
      if (time <= 0) {
        //if timer is less than 0
        setTimeCount('00');
        if (counter) {
          clearInterval(counter);
        }
        //clear counter
        setShowTimeOff(true); //change the time text to time off
        console.log('questionIndex', questionIndex);
        let correcAns = questions[questionIndex].answer; //getting correct answer from array
        for (let i = 0; i < 4; i++) {
          if (questions[questionIndex].options[i] == correcAns) {
            //if there is an option which is matched to an array answer
            setCoorectOptionIndex(i); //adding green color to matched option
            setShowTickIcon(true); //adding tick icon to matched option
            console.log('Time Off: Auto selected correct answer.');
          }
        }

        setDisableOption(true); //once user select an option then disabled all options

        setShowNextBtn(true); //show the next button if user selected any option
      }
    }
  }
  const continueQuiz = () => {
    // setQuizState('quiz');

    setIsInfoAtive(false);
    setIsQuizActive(true);
    showQuestion(0); //calling showQestions function
    setQuesCounter(1); //passing 1 parameter to queCounter
    startTimer(15, 0); //calling startTimer function
    startTimerLine(0); //calling startTimerLine function
  };

  const nextQuestion = () => {
    if (counter) {
      clearInterval(counter);
    }
    if (counterLine) {
      clearInterval(counterLine);
    }
    setInoorectOptionIndex(null);
    setCoorectOptionIndex(null);
    setShowCrossIcon(false);
    setShowTickIcon(false);
    setDisableOption(false); //once user select an option then disabled all options

    setShowNextBtn(false);
    if (questionIndex < questions.length - 1) {
      //if question count is less than total question length
      //increment the que_numb value

      showQuestion(questionIndex + 1); //calling showQestions function
      setQuesCounter(quesCounter + 1); //passing que_numb value to queCounter
      //clear counterLine
      startTimer(timeValue, questionIndex + 1); //calling startTimer function
      startTimerLine(widthValue); //calling startTimerLine function
      setShowTimeOff(false);
      setShowNextBtn(false);
      // timeText.textContent = 'Time Left'; //change the timeText to Time Left
      // next_btn.classList.remove('show'); //hide the next button
    } else {
      if (counter) {
        clearInterval(counter);
      }
      if (counterLine) {
        clearInterval(counterLine);
      } //clear counterLine
      showResult(); //calling showResult function
    }
  };

  function optionSelected(answer, ind) {
    if (counter) {
      clearInterval(counter);
    }
    if (counterLine) {
      clearInterval(counterLine);
    } //clear counterLine
    let userAns = answer; //getting user selected option
    let correcAns = questions[questionIndex].answer; //getting correct answer from array

    if (userAns == correcAns) {
      //if user selected option is equal to array's correct answer
      setScore((prev) => prev + 1); //upgrading score value with 1
      setCoorectOptionIndex(ind); //adding green color to correct selected option
      setShowTickIcon(true); //adding tick icon to correct selected option
      console.log('Correct Answer');
    } else {
      setInoorectOptionIndex(ind); //adding red color to correct selected option
      setShowCrossIcon(true); //adding cross icon to correct selected option
      console.log('Wrong Answer');

      for (let i = 0; i < 4; i++) {
        if (questions[questionIndex].options[i] == correcAns) {
          //if there is an option which is matched to an array answer
          setCoorectOptionIndex(i); //adding green color to matched option
          setShowTickIcon(true); //adding tick icon to matched option
          console.log('Auto selected correct answer.');
        }
      }
    }
    setDisableOption(true); //once user select an option then disabled all options

    setShowNextBtn(true); //show the next button if user selected any option
  }

  return (
    // <!-- start Quiz button -->
    <div style={{ height: '100vh' }}>
      <div className="start_btn">
        <button onClick={() => setIsInfoAtive(true)}>Start Quiz</button>
      </div>

      {/* <!-- Info Box --> */}
      <div className={`info_box ${isInfoActive ? 'activeInfo' : ''}`}>
        <div className="info-title">
          <span>Some Rules of this Quiz</span>
        </div>
        <div className="info-list">
          <div className="info">
            1. You will have only <span>15 seconds</span> per each question.
          </div>
          <div className="info">
            2. Once you select your answer, it cant be undone.
          </div>
          <div className="info">
            3. You cant select any option once time goes off.
          </div>
          <div className="info">
            4. You cant exit from the Quiz while youre playing.
          </div>
          <div className="info">
            5. You will get points on the basis of your correct answers.
          </div>
        </div>
        <div className="buttons">
          <button className="quit" onClick={() => setIsInfoAtive(false)}>
            Exit Quiz
          </button>
          <button className="restart" onClick={continueQuiz}>
            Continue
          </button>
        </div>
      </div>

      {/* // <!-- Quiz Box --> */}
      <div className={`quiz_box ${isQuizActive ? 'activeQuiz' : ''}`}>
        <header>
          <div className="title">Awesome Quiz Application</div>
          <div className="timer">
            <div className="time_left_txt">
              {showTimeOff ? 'Time Off' : 'Time Left'}
            </div>
            <div className="timer_sec">{timeCount}</div>
          </div>
          <div
            className="time_line"
            style={{ width: `${timeLineWidth}px` }}
          ></div>
        </header>
        <section>
          <div className="que_text">
            <span>
              {questions[questionIndex].numb +
                '. ' +
                questions[questionIndex].question}
            </span>
          </div>
          <div className="option_list">
            <div
              tabIndex={0}
              role="button"
              className={`option ${correctOptionIndex == 0 ? 'correct' : ''} ${
                disableOption ? 'disabled' : ''
              } ${incorrectOptionIndex == 0 ? 'incorrect' : ''}`}
              onClick={() =>
                optionSelected(questions[questionIndex].options[0], 0)
              }
              onKeyDown={() =>
                optionSelected(questions[questionIndex].options[0], 0)
              }
            >
              <span>{questions[questionIndex].options[0]}</span>
              {showTickIcon && correctOptionIndex == 0 && (
                <div className="icon tick">
                  <i className="fas fa-check"></i>
                </div>
              )}
              {showCrossIcon && incorrectOptionIndex == 0 && (
                <div className="icon cross">
                  <i className="fas fa-times"></i>
                </div>
              )}
            </div>
            <div
              tabIndex={-1}
              role="button"
              className={`option ${correctOptionIndex == 1 ? 'correct' : ''} ${
                disableOption ? 'disabled' : ''
              } ${incorrectOptionIndex == 1 ? 'incorrect' : ''}`}
              onClick={() =>
                optionSelected(questions[questionIndex].options[1], 1)
              }
              onKeyDown={() =>
                optionSelected(questions[questionIndex].options[1], 1)
              }
            >
              <span>{questions[questionIndex].options[1]}</span>
              {showTickIcon && correctOptionIndex == 1 && (
                <div className="icon tick">
                  <i className="fas fa-check"></i>
                </div>
              )}
              {showCrossIcon && incorrectOptionIndex == 1 && (
                <div className="icon cross">
                  <i className="fas fa-times"></i>
                </div>
              )}
            </div>
            <div
              tabIndex={-2}
              role="button"
              className={`option ${correctOptionIndex == 2 ? 'correct' : ''} ${
                disableOption ? 'disabled' : ''
              } ${incorrectOptionIndex == 2 ? 'incorrect' : ''}`}
              onClick={() =>
                optionSelected(questions[questionIndex].options[2], 2)
              }
              onKeyDown={() =>
                optionSelected(questions[questionIndex].options[2], 2)
              }
            >
              <span>{questions[questionIndex].options[2]}</span>
              {showTickIcon && correctOptionIndex == 2 && (
                <div className="icon tick">
                  <i className="fas fa-check"></i>
                </div>
              )}
              {showCrossIcon && incorrectOptionIndex == 2 && (
                <div className="icon cross">
                  <i className="fas fa-times"></i>
                </div>
              )}
            </div>
            <div
              tabIndex={-3}
              role="button"
              className={`option ${correctOptionIndex == 3 ? 'correct' : ''} ${
                disableOption ? 'disabled' : ''
              } ${incorrectOptionIndex == 3 ? 'incorrect' : ''}`}
              onClick={() =>
                optionSelected(questions[questionIndex].options[3], 3)
              }
              onKeyDown={() =>
                optionSelected(questions[questionIndex].options[3], 3)
              }
            >
              <span>{questions[questionIndex].options[3]}</span>
              {showTickIcon && correctOptionIndex == 3 && (
                <div className="icon tick">
                  <i className="fas fa-check"></i>
                </div>
              )}
              {showCrossIcon && incorrectOptionIndex == 3 && (
                <div className="icon cross">
                  <i className="fas fa-times"></i>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer>
          <div className="total_que">
            <span>
              <p>
                {' '}
                {quesCounter} of {questions.length}
              </p>{' '}
              Questions
            </span>
          </div>
          <button
            className={`next_btn ${showNextBtn ? 'show' : 0}`}
            onClick={nextQuestion}
          >
            Next Que
          </button>
        </footer>
      </div>

      {/* // <!-- Result Box --> */}
      <div className={`result_box ${isResultActive ? 'activeResult' : ''}`}>
        <div className="icon">
          <i className="fas fa-crown"></i>
        </div>
        <div className="complete_text">You have completed the Quiz!</div>
        <div
          className="score_text"
          dangerouslySetInnerHTML={{ __html: scoreText }}
        ></div>
        <div className="buttons">
          <button className="restart" onClick={restartQuiz}>
            Replay Quiz
          </button>
          <button className="quit" onClick={quitQuiz}>
            Quit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
