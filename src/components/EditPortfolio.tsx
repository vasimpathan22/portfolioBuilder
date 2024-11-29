import React, { useState, ChangeEvent } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Portfolio } from "../types/types";
import portfolioService from "../service/portfolioService";

const EditPortfolio: React.FC = () => {
  const { updatePortfolio } = usePortfolio();
  const navigate = useNavigate();
  const location = useLocation();
  const isUserCreatingPortfolio = location.pathname === "/create";

  const [formData, setFormData] = useState<Portfolio | null>(
    portfolioService.getPortfolio()
  );

  const handleInputChange = (
    section: string, //input is being updated as section wise {about, skills, projects, contact}
    key: string, //in each section which key is to be updated
    value: string | Record<string, string> //the new value of that key
  ) => {
    setFormData((prev) => ({
      ...prev, //firstlyset the previous data
      [section]: {
        //select the section which is being updated
        ...prev[section], //give the previous data to the section
        [key]: value, //update the key with new value
      },
    }));
  };

  const handleArrayChange = (
    section: string,
    index: number,
    value: string | Record<string, string>
  ) => {
    const updatedArray = [...formData[section]]; //select the array which is being updated
    updatedArray[index] = value; //add the new value at that place
    setFormData((prev) => ({
      ...prev,
      [section]: updatedArray, //update the formData
    }));
  };

  const handleArrayAdd = (
    section: string,
    newItem: string | Record<string, string>
  ) => {
    const updatedArray = [...formData[section], newItem];
    setFormData((prev) => ({
      ...prev,
      [section]: updatedArray,
    }));
  };

  const handleArrayRemove = (section: string, index: number) => {
    const updatedArray = formData[section].filter(
      (_: any, i: number) => i !== index
    ); //filter out the item where index is not the same
    setFormData((prev) => ({
      ...prev,
      [section]: updatedArray,
    }));
  };

  const handleSubmit = () => {
    updatePortfolio(formData);
    navigate("/preview");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-3">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* About Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">About</h3>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="Name"
            value={formData?.about?.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("about", "name", e.target.value)
            }
          />
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="Tagline"
            value={formData?.about?.tagline}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("about", "tagline", e.target.value)
            }
          />
          <textarea
            className="w-full mt-2 p-2 border rounded"
            placeholder="Description"
            value={formData?.about?.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange("about", "description", e.target.value)
            }
          />
        </section>

        {/* Skills Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
          {formData?.skills?.map((skill: string, index: number) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={skill}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleArrayChange("skills", index, e.target.value)
                }
              />
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleArrayRemove("skills", index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => handleArrayAdd("skills", "")}
          >
            Add Skill
          </button>
        </section>

        {/* Projects Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
          {formData?.projects?.map(
            (
              project: { title: string; description: string; link: string },
              index: number
            ) => (
              <div key={index} className="mt-4 p-4 border rounded">
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleArrayChange("projects", index, {
                      ...project,
                      title: e.target.value,
                    })
                  }
                />
                <textarea
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleArrayChange("projects", index, {
                      ...project,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Project Link"
                  value={project.link}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleArrayChange("projects", index, {
                      ...project,
                      link: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="mt-2 text-red-500"
                  onClick={() => handleArrayRemove("projects", index)}
                >
                  Remove Project
                </button>
              </div>
            )
          )}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() =>
              handleArrayAdd("projects", {
                title: "",
                description: "",
                link: "",
              })
            }
          >
            Add Project
          </button>
        </section>

        {/* Contact Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Contact</h3>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="Email"
            value={formData?.contact?.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("contact", "email", e.target.value)
            }
          />
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded"
            placeholder="Phone"
            value={formData?.contact?.phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("contact", "phone", e.target.value)
            }
          />
        </section>

        {/* Save Button */}
        <section className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-green-500 text-white rounded"
            onClick={handleSubmit}
          >
            {isUserCreatingPortfolio ? "Create Portfolio" : "Save Changes"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default EditPortfolio;
