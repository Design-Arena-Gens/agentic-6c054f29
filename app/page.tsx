'use client';

import { useState, useEffect, useRef } from 'react';

interface Exercise {
  name: string;
  duration: number;
  reps: string;
  instructions: string;
}

const workout: Exercise[] = [
  {
    name: 'Goblet Squats',
    duration: 45,
    reps: '12-15 reps',
    instructions: 'Hold one dumbbell vertically at chest height. Squat down keeping chest up, then drive through heels to stand.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Breathe deeply and prepare for next exercise.'
  },
  {
    name: 'Push-ups (Dumbbells as Handles)',
    duration: 30,
    reps: '10-15 reps',
    instructions: 'Use dumbbells as push-up handles for better range of motion. Keep core tight and body straight.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Shake out arms and shoulders.'
  },
  {
    name: 'Bent-Over Dumbbell Rows',
    duration: 45,
    reps: '12-15 reps each arm',
    instructions: 'Hinge at hips, keep back flat. Pull dumbbell to hip, squeeze shoulder blade. Alternate arms or do one side at a time.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Stay hydrated if needed.'
  },
  {
    name: 'Standing Shoulder Press',
    duration: 45,
    reps: '10-12 reps',
    instructions: 'Press dumbbells overhead from shoulder height. Keep core engaged and avoid arching lower back.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Roll shoulders and breathe.'
  },
  {
    name: 'Dumbbell Romanian Deadlifts',
    duration: 45,
    reps: '12-15 reps',
    instructions: 'Hinge at hips with slight knee bend, lower dumbbells along legs. Feel stretch in hamstrings, return to standing.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Almost there! Catch your breath.'
  },
  {
    name: 'Bicep Curls',
    duration: 30,
    reps: '12-15 reps',
    instructions: 'Keep elbows at sides, curl dumbbells to shoulders. Control the descent.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Prepare for triceps.'
  },
  {
    name: 'Overhead Tricep Extensions',
    duration: 30,
    reps: '12-15 reps',
    instructions: 'Hold one dumbbell with both hands overhead. Lower behind head, then extend arms.'
  },
  {
    name: 'Rest',
    duration: 15,
    reps: 'Recovery',
    instructions: 'Final exercise coming up!'
  },
  {
    name: 'Dumbbell Russian Twists',
    duration: 45,
    reps: '20-30 twists',
    instructions: 'Sit with knees bent, hold one dumbbell at chest. Lean back slightly, rotate torso side to side.'
  },
  {
    name: 'Cool Down',
    duration: 30,
    reps: 'Stretch',
    instructions: 'Light stretching: arms overhead, touch toes, quad stretches. Great work!'
  }
];

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout[0].duration);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalTime = workout.reduce((sum, ex) => sum + ex.duration, 0);
  const elapsedTime = workout.slice(0, currentIndex).reduce((sum, ex) => sum + ex.duration, 0) + (workout[currentIndex].duration - timeLeft);
  const progress = (elapsedTime / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentIndex < workout.length - 1) {
      playBeep();
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(workout[currentIndex + 1].duration);
    } else if (timeLeft === 0 && currentIndex === workout.length - 1) {
      setIsRunning(false);
      playBeep();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentIndex]);

  const playBeep = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    setTimeLeft(workout[0].duration);
    setHasStarted(false);
  };

  const handleSkip = () => {
    if (currentIndex < workout.length - 1) {
      playBeep();
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(workout[currentIndex + 1].duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>15-Minute Full Body Workout</h1>
        <p>Efficient dumbbell routine targeting all major muscle groups</p>
      </header>

      <div className="info-cards">
        <div className="info-card">
          <h3>Duration</h3>
          <p>15 min</p>
        </div>
        <div className="info-card">
          <h3>Equipment</h3>
          <p>5kg Dumbbells</p>
        </div>
        <div className="info-card">
          <h3>Exercises</h3>
          <p>{workout.filter(e => !e.name.includes('Rest') && !e.name.includes('Cool')).length}</p>
        </div>
        <div className="info-card">
          <h3>Focus</h3>
          <p>Full Body</p>
        </div>
      </div>

      <div className="timer-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="timer-display">{formatTime(timeLeft)}</div>
        <div className="current-exercise">{workout[currentIndex].name}</div>
        <div className="exercise-info">
          {workout[currentIndex].reps} • Exercise {currentIndex + 1} of {workout.length}
        </div>

        <div className="controls">
          {!isRunning && !hasStarted && (
            <button className="btn btn-primary" onClick={handleStart}>
              Start Workout
            </button>
          )}
          {isRunning && (
            <button className="btn btn-secondary" onClick={handlePause}>
              Pause
            </button>
          )}
          {!isRunning && hasStarted && currentIndex < workout.length - 1 && (
            <button className="btn btn-primary" onClick={handleStart}>
              Resume
            </button>
          )}
          {hasStarted && (
            <>
              <button className="btn btn-secondary" onClick={handleSkip} disabled={currentIndex === workout.length - 1}>
                Skip
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      <div className="workout-list">
        {workout.map((exercise, index) => (
          <div
            key={index}
            className={`exercise-card ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
          >
            <div className="exercise-header">
              <div className="exercise-name">{exercise.name}</div>
              <div className="exercise-duration">{exercise.duration}s</div>
            </div>
            <div className="exercise-details">
              <strong>{exercise.reps}</strong> • {exercise.instructions}
            </div>
          </div>
        ))}
      </div>

      <div className="tips">
        <h2>Training Tips</h2>
        <ul>
          <li><strong>Consistency over perfection:</strong> Even 3-4 days per week will yield results. Don't stress about missing days.</li>
          <li><strong>Progressive overload:</strong> As exercises become easier, slow down reps for more time under tension or add a pause at peak contraction.</li>
          <li><strong>Form first:</strong> Quality reps beat quantity. Control the weight through full range of motion.</li>
          <li><strong>Nutrition matters:</strong> Protein (1.6-2.2g per kg bodyweight) and slight calorie surplus support muscle growth.</li>
          <li><strong>Recovery is growth:</strong> Muscle builds during rest. Get 7-9 hours of sleep when possible.</li>
          <li><strong>Track progress:</strong> Note when exercises feel easier. This indicates strength gains.</li>
        </ul>
      </div>
    </div>
  );
}
