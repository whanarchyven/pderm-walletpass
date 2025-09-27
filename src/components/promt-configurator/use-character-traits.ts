import { useEffect, useState } from 'react';
const getRandomValue = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

const useCharacterTraits = (characterTraitsValues) => {
  const [value, setValue] =  useState({
    universe: getRandomValue(characterTraitsValues.universe.values),
    characterArchetype: getRandomValue(characterTraitsValues.characterArchetype.values),
    brand: characterTraitsValues.brand.values[0],
    language: characterTraitsValues.language.values[1],
    emotion: getRandomValue(characterTraitsValues.emotion.values),
    motivation: getRandomValue(characterTraitsValues.motivation.values),
    socialType: getRandomValue(characterTraitsValues.socialType.values),
    thinkingStyle: getRandomValue(characterTraitsValues.thinkingStyle.values),
  });
  const [seed,setSeed]=useState(Math.random())
  useEffect(()=>{
    setSeed(Math.random());
  },[])

  const setKeyValue = (key, newValue) => {
    setSeed(Math.random())
    setValue({ ...value, [key]: newValue });
  };

  return {
seed,
    value,
    setKeyValue,
  };
};

export default useCharacterTraits;
