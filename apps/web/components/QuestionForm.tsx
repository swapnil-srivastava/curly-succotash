"use client"

import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import toast from "react-hot-toast";
import axios from 'axios';

import { BACKEND_URL, Question } from "../config/library";

const fetchQuestions = async () => {
    try {
        const { data, status } = await axios.get(`${BACKEND_URL}/questions`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        const { _embedded } = data;
        const { questions } = _embedded;
        const { questionText } = questions;
        console.log("fetchQuestions:::: questions", questionText);
        console.log("fetchQuestions:::: questionText", questionText);

        toast.success("Questions Retrived!!");
        return questions;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`"error message: ", ${error.message}`);
          return error.message;
        } else {
          toast.error(`"unexpected error: ", ${error}`);
          return "An unexpected error occurred";
        }
      }
};
  
const fetchChoicesForQuestion = async (questionId: number) => {
  function extractChoiceIdFromUrl(url: string): number {
    if (!url) {
      throw new Error('URL is undefined');
    }
  
    // Split the URL by '/' and get the last part
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Check if lastPart exists
    if (!lastPart) {
      throw new Error('Invalid URL format: No ID found');
    }
  
    // Parse the last part as an integer
    const id = parseInt(lastPart, 10);
    
    // Check if the parsed value is a valid number
    if (isNaN(id)) {
      throw new Error('Invalid URL format: Unable to extract ID');
    }
    
    return id;
  }
    try {
        const { data, status } = await axios.get(`${BACKEND_URL}/questions/${questionId}/choices`,
            {
            headers: {
                "Content-Type": "application/json",
            },
            }
        );
        
        const { _embedded } = data;
        const { choices } = _embedded;

        const processedChoices = choices.map((choice: any) => ({
            id: extractChoiceIdFromUrl(choice._links.self.href),
            choiceText: choice.choiceText
        }));

        toast.success("Choices Retrived!!");
        return processedChoices;

    } catch (error) {
    if (axios.isAxiosError(error)) {
        toast.error(`"error message: ", ${error.message}`);
        return error.message;
    } else {
        toast.error(`"unexpected error: ", ${error}`);
        return "An unexpected error occurred";
    }
    }
};

const QuestionForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  function extractIdFromUrl(url: string): number {
    if (!url) {
      throw new Error('URL is undefined');
    }
  
    // Split the URL by '/' and get the last part
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Check if lastPart exists
    if (!lastPart) {
      throw new Error('Invalid URL format: No ID found');
    }
  
    // Parse the last part as an integer
    const id = parseInt(lastPart, 10);
    
    // Check if the parsed value is a valid number
    if (isNaN(id)) {
      throw new Error('Invalid URL format: Unable to extract ID');
    }
    
    return id;
  }

  useEffect(() => {
    fetchQuestionsAndChoices();
  }, []);

  const fetchQuestionsAndChoices = async () => {
    try {
      const questionsData = await fetchQuestions();
      console.log("questionsData ::::",questionsData);
  
      const questionsWithChoices = await Promise.all(
        questionsData.map(async (question: any) => {
          console.log("questionsData  inside map ::::", question);
          console.log(":::::::::::::", question);
          const { _links, questionText } = question;
          console.log("questionText  inside map ::::", questionText);
          console.log("_links inside map ::::", _links);
          console.log(":::::::::::::", question);
          const { choices: choicesLink , self: selfChoices, question: questionLinks } = _links;
          console.log("choicesLink  inside map ::::", choicesLink);
          console.log("selfChoices inside map ::::", selfChoices);
          console.log("questionLinks inside map ::::", questionLinks);
          const { href } = selfChoices;
          console.log("href inside map ::::", href);

          // Extract the ID from the selfHref
          const id = extractIdFromUrl(href);
          console.log("id inside map ::::", id);
  
          const choices = await fetchChoicesForQuestion(id);

          console.log("choices inside map::::", choices);
  
          // Add error checking for choices
          if (!Array.isArray(choices)) {
            console.error(`Choices for question ${id} is not an array:`, choices);
            return null; // or handle this case as appropriate
          }
  
          // Create a new object with the desired properties, excluding _links
          const questionWithChoices = {
            id,
            questionText,
            choices
          };
  
          console.log("final json question with choices :::: questionWithChoices", questionWithChoices);
  
          return questionWithChoices;
        })
      );
  
      // Filter out any null values (questions that failed to fetch)
      const validQuestions = questionsWithChoices.filter(q => q !== null);
  
      setQuestions(validQuestions);
  
    } catch (error) {
      console.error('Error fetching questions and choices:', error);
    }
  };

  const schema = {
    type: 'object',
    properties: questions.reduce((acc, question) => {
      acc[`question_${question.id}`] = {
        type: 'string',
        enum: question.choices.map(choice => choice.id.toString()),
        enumNames: question.choices.map(choice => choice.choiceText)
      };
      return acc;
    }, {} as { [key: string]: any })
  };
  
  
  // Working with choicetext
  // const schema = {
  //   type: 'object',
  //   properties: questions.reduce((acc, question) => {
  //     acc[`question_${question.id}`] = {
  //       type: 'string',
  //       enum: question.choices.map(choice => choice.choiceText),
  //       enumNames: question.choices.map(choice => choice.choiceText)
  //     };
  //     return acc;
  //   }, {} as { [key: string]: any })
  // };

  // Workng with ID
  // const schema = {
  //   type: 'object',
  //   properties: questions.reduce((acc, question) => {
  //     acc[`question_${question.id}`] = {
  //       type: 'string',
  //       enum: question.choices.map(choice => (choice.id != null ? choice.id.toString() : 'undefined')),
  //       enumNames: question.choices.map(choice => choice.choiceText || 'No Text')
  //     };
  //     return acc;
  //   }, {} as { [key: string]: any })
  // };

  const uiSchema = {
    type: 'VerticalLayout',
    elements: questions.map(question => ({
      type: 'Control',
      scope: `#/properties/question_${question.id}`,
      label: question.questionText,
      options: {
        format: 'radio'
      }
    }))
  };

  const handleChange = ({ data }: { data: any }) => {
    setFormData(data);
  };

  // const handleSubmit = () => {
  //   const answers = Object.entries(formData)
  //     .map(([key, value]) => {
  //       const parts = key.split('_');
  //       const questionIdString = parts[1];
  //       const questionId = questionIdString ? parseInt(questionIdString, 10) : null;
        
  //       if (questionId === null || isNaN(questionId)) {
  //         console.error(`Invalid question ID in key: ${key}`);
  //         return null;
  //       }
  
  //       const choiceId = value ? parseInt(value, 10) : null;
  //       if (choiceId === null || isNaN(choiceId)) {
  //         console.error(`Invalid choice ID for question ${questionId}: ${value}`);
  //         return null;
  //       }
  
  //       return { questionId, choiceId };
  //     })
  //     .filter((answer): answer is { questionId: number; choiceId: number } => answer !== null);
  
  //   console.log('Submitted answers:', answers);
  //   // Here you would typically send the answers to your API
  // };
  
  const handleSubmit = () => {
    const answers = Object.entries(formData).map(([key, value]) => {
      const parts = key.split('_');
      if (parts.length < 2) {
        console.error(`Invalid key format: ${key}`);
        return null;
      }
  
      const questionIdString = parts[1];
      if (questionIdString === undefined) {
        console.error(`Question ID is undefined for key: ${key}`);
        return null;
      }
  
      const questionId = parseInt(questionIdString, 10);
      if (isNaN(questionId)) {
        console.error(`Unable to parse question ID: ${questionIdString}`);
        return null;
      }
  
      const question = questions.find(q => q.id === questionId);
      if (!question) {
        console.error(`Question not found for ID: ${questionId}`);
        return null;
      }
  
      const choice = question.choices.find(c => c.id.toString() === value);
      if (!choice) {
        console.error(`Choice not found for question ${questionId}: ${value}`);
        return null;
      }
  
      return { questionId, choiceId: choice.id, choiceText: choice.choiceText };
    }).filter((answer): answer is { questionId: number; choiceId: number; choiceText: string } => answer !== null);
  
    console.log('Submitted answers:', answers);
    // Here you would typically send the answers to your API
  };
  

  return (
    <div>
    {questions.length > 0 ? (
      <>
        <JsonForms
          schema={schema}
          uischema={uiSchema}
          data={formData}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </>
    ) : (
      <p>Loading questions...</p>
    )}
    </div>
  );
};

export default QuestionForm;