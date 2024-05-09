import { useState } from "react";

export const FileTab = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    {
      id: 1,
      name: "example1.txt",
      content: (
        <code>
          The city lights shimmered in the distance. <br /> Urban life is
          fast-paced and dynamic. <br />
          Skyscrapers defined the city skyline. <br />
          People hurried along the bustling streets. <br />
          Street vendors added color to the cityscape. <br />
          Parks provided an oasis in the heart of the city. <br />
          Public transportation connected every corner. <br />
          The city never sleeps; it&apos;s alive 24/7. <br />
          Cultural diversity thrived in every neighborhood.
        </code>
      ),
    },
    {
      id: 2,
      name: "example2.txt",
      content: (
        <code>
          id01&nbsp;&nbsp;The city lights shimmered in the distance. <br />
          id02&nbsp;&nbsp;Urban life is fast-paced and dynamic. <br />
          id03&nbsp;&nbsp;Skyscrapers defined the city skyline. <br />
          id04&nbsp;&nbsp;People hurried along the bustling streets. <br />
          id05&nbsp;&nbsp;Street vendors added color to the cityscape. <br />
          id06&nbsp;&nbsp;Parks provided an oasis in the heart of the city.
          <br />
          id07&nbsp;&nbsp;Public transportation connected every corner. <br />
          id08&nbsp;&nbsp;The city never sleeps; it&apos;s alive 24/7. <br />
          id09&nbsp;&nbsp;Cultural diversity thrived in every neighborhood.
        </code>
      ),
    },
  ];
  return (
    <div className="">
      <div className="flex">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.id}
              className={`border-t border-x transition rounded-t-md rounded-x-md text-xs px-4 py-2 text-right text-muted-foreground ${
                activeTab === tab.id
                  ? "bg-muted"
                  : "border-muted hover:bg-muted/50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      <div className="bg-muted w-full rounded-md rounded-tl-none py-6 px-6 text-xs">
        {tabs.map((tab) => {
          return (
            <div key={tab.id} className={`${activeTab !== tab.id && "hidden"}`}>
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
