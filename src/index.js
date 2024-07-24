document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterBtn = document.getElementById('good-dog-filter');
    let filterGoodDogs = false;
  
    // Fetch and display all dogs
    const fetchDogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/pups');
        const dogs = await response.json();
        displayDogs(dogs);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };
  
    // Display dogs in the dog bar
    const displayDogs = (dogs) => {
      dogBar.innerHTML = '';
      dogs.forEach(dog => {
        if (!filterGoodDogs || (filterGoodDogs && dog.isGoodDog)) {
          const dogSpan = document.createElement('span');
          dogSpan.textContent = dog.name;
          dogSpan.addEventListener('click', () => displayDogInfo(dog));
          dogBar.appendChild(dogSpan);
        }
      });
    };
  
    // Display selected dog info
    const displayDogInfo = (dog) => {
      dogInfo.innerHTML = `
        <img src="${dog.image}" alt="${dog.name}">
        <h2>${dog.name}</h2>
        <button id="good-dog-btn">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
      const goodDogBtn = document.getElementById('good-dog-btn');
      goodDogBtn.addEventListener('click', () => toggleGoodDog(dog));
    };
  
    // Toggle good/bad dog status
    const toggleGoodDog = async (dog) => {
      try {
        const updatedDog = { ...dog, isGoodDog: !dog.isGoodDog };
        const response = await fetch(`http://localhost:3000/pups/${dog.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDog)
        });
        const newDog = await response.json();
        displayDogInfo(newDog);
        fetchDogs();
      } catch (error) {
        console.error('Error updating dog:', error);
      }
    };
  
    // Filter good dogs
    filterBtn.addEventListener('click', () => {
      filterGoodDogs = !filterGoodDogs;
      filterBtn.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`;
      fetchDogs();
    });
  
    fetchDogs();
  });
  