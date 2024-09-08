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
        console.log("fetchQuestions:::: questions", questions)
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

        toast.success("Choices Retrived!!");
        return choices;

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

  useEffect(() => {
    fetchQuestionsAndChoices();
  }, []);
  const fetchQuestionsAndChoices = async () => {
    try {
      const questionsData = await fetchQuestions();
      const questionsWithChoices = await Promise.all(
        questionsData.map(async (question: Question) => {
          const choices = await fetchChoicesForQuestion(question.id);
          return { ...question, choices };
        })
      );
      setQuestions(questionsWithChoices);
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

  const handleSubmit = () => {
    const answers = Object.entries(formData)
    .map(([key, value]) => {
      const parts = key.split('_');
      const questionIdString = parts[1];
      const questionId = questionIdString ? parseInt(questionIdString, 10) : null;
      
      if (questionId === null || isNaN(questionId)) {
        console.error(`Invalid question ID in key: ${key}`);
        return null;
      }

      const choiceId = parseInt(value, 10);
      if (isNaN(choiceId)) {
        console.error(`Invalid choice ID for question ${questionId}: ${value}`);
        return null;
      }

      return { questionId, choiceId };
    })
    .filter((answer): answer is { questionId: number; choiceId: number } => answer !== null);

  console.log('Submitted answers:', answers);
  // Here you would typically send the answers to your API

  };

  return (
    <div>
      <JsonForms
        schema={schema}
        uischema={uiSchema}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default QuestionForm;