"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";


export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);

  // useEffect(函式,陣列)
  useEffect(() => {
    // 當依賴的陣列是空時，這裡的程式只會在網頁打開時被觸發一次
    console.log("跟後端要資料。。。。")
    axios
      .get("/api/vocab-ai")
      .then(res => {
        console.log("res:", res.data)
        setVocabList(res.data)
      })
      .catch(err => {
        console.log("err:", err)
        alert("error")
      })

  }, [])

  function submitHandler(e) {
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
    const body = { userInput, language };
    console.log("body:", body);
    // 讓畫面顯示等待中
    setIsWaiting(true)
    // 清空輸入框
    setUserInput("")
    // 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    axios
      .post("/api/vocab-ai", body)
      .then(res => {
        console.log("後端的回應：", res)
        const result = res.data
        console.log("result:", result)
        setVocabList([result, ...vocabList])
        setIsWaiting(prev => false)
      })
      .catch(err => {
        console.log("出錯：", err)
        setIsWaiting(prev => false)
        alert("發生錯誤，請重新嘗試")
      })
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  type="text"
                  className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                  placeholder="Enter a word or phrase"
                  required
                />
              </div>
              <div className="w-1/5 px-2">
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Vietnamese">Vietnamese</option>
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* 等待後端回應時要顯示的載入畫面 */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/* 顯示AI輸出結果 */}
          {
            vocabList.map(result => {
              // console.log( "result":result)
              return <VocabGenResultCard key={result.createdAt} result={result} />
            })
          }
          {/* 一張單字生成卡的範例，串接正式API後移除 */}
          {/* <VocabGenResultCard
            result={{
              title: "水果",
              payload: {
                wordList: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
                zhWordList: ["蘋果", "香蕉", "櫻桃", "棗子", "接骨木"],
              },
              language: "English",
              createdAt: new Date().getTime(),
            }}
          /> */}
        </div>
      </section>
    </>
  );
}
