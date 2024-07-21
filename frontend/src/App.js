import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import ReactDom from "react-dom";

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
function App() {
  // const keyLime =
  //   "https://www.allrecipes.com/thmb/1aP8lFhJJXky1qjk5fbMTzVAjtU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/12698-Easy-Key-Lime-Pie-ddmfs-103444-4x3-1-eb1a59500e384b2b8939094ce18d08be.jpg";
  const [inputText, setInputText] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState("");
  const [url, setUrl] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(event);

    console.log("Description submitted: \n" + inputText);
    setDescription(inputText);

    var newPrompt =
      "Please give me a recipe based on the following description. Only include the recipe, formatted in markdown: \n" +
      inputText;

    console.log(newPrompt);

    try {
      // Recipe text generation
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: newPrompt }],
        model: "gpt-4o", // Specify your desired model
      });

      setResponse(completion.choices[0].message.content);
      console.log(response);

      // Image generation
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: inputText,
        n: 1,
        size: "1024x1024",
      });

      const image_url = imageResponse.data[0].url;
      setUrl(image_url);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInputText("");
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log("Recipe submitted: \n" + inputText);
  //   setCopiedText(inputText);
  //   setInputText("");
  // };

  return (
    <div className="App">
      <h1 className="text-center mt-5">Dream Recipe Generator</h1>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type your dream recipe..."
                />
              </div>
              <button type="submit" className="btn btn-primary mb-3">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="container text-center">
        <div className="row justify-content-around">
          <div className="col-5">
            {description && (
              <div className="card">
                <div className="card-body border-bottom">
                  <h5 className="card-title">Recipe Description</h5>
                  <hr className="my-3" /> {/* Inserting horizontal line */}
                  <p className="card-text">
                    <ReactMarkdown>{description}</ReactMarkdown>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col mt-4">
          {url && (
            <img
              src={url}
              style={{ width: "50%", height: "auto" }}
              className="img-fluid"
              alt="Image"
            />
          )}
        </div>
      </div>

      {response && (
        <div className="card mt-3 custom-card">
          <div className="card-body col markdown-container">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
