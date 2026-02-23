function showExerciseDetails(exercise) {
    const modal = document.getElementById('exercise-modal');
    const modalTitle = document.getElementById('exercise-modal-title');
    const modalImage = document.getElementById('exercise-modal-image');
    const modalBodyPart = document.getElementById('exercise-modal-bodypart');
    const modalTarget = document.getElementById('exercise-modal-target');
    const modalEquipment = document.getElementById('exercise-modal-equipment');

    if (!modal) return;

    modalTitle.textContent = exercise.name || 'Exercise Details';

    const imageUrl = exercise.gifUrl || getExerciseImage(exercise.name);
    modalImage.src = imageUrl;
    modalImage.alt = exercise.name;

    modalBodyPart.textContent = exercise.bodyPart || 'N/A';
    modalTarget.textContent = exercise.target || 'N/A';
    modalEquipment.textContent = exercise.equipment || 'Body weight';

    const instructionsSection = document.getElementById('exercise-instructions-section');
    const instructionsList = document.getElementById('exercise-modal-instructions');
    if (exercise.instructions && exercise.instructions.length > 0) {
        instructionsList.innerHTML = exercise.instructions.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('');
        if (instructionsSection) instructionsSection.style.display = 'block';
    } else {
        if (instructionsSection) instructionsSection.style.display = 'none';
    }

    modal.classList.add('active');
}
