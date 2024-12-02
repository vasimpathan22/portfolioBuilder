import { Component } from "react";
import { WithNavigation } from "./WithNavigation";
import { PortfolioContext } from "../context/PortfolioContext";
import portfolioService from "../service/portfolioService";
import { Portfolio } from "../types/types";

class EditPortfolioClass extends Component<
  object,
  { formData: Portfolio | null }
> {
  static contextType = PortfolioContext;

  constructor(props: object) {
    super(props);

    this.state = {
      formData: portfolioService.getLocalStoragePortfolio() || null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayChange = this.handleArrayChange.bind(this);
    this.handleArrayAdd = this.handleArrayAdd.bind(this);
    this.handleArrayRemove = this.handleArrayRemove.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleSocialLinkChange = this.handleSocialLinkChange.bind(this);
    this.handleSocialLinkRemove = this.handleSocialLinkRemove.bind(this);
    this.handleSocialLinkAdd = this.handleSocialLinkAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(section: string, key: string, value: string) {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: {
          ...prevState.formData[section],
          [key]: value,
        },
      },
    }));
  }

  handleArrayChange(section: string, index: number, value: string) {
    const updatedArray = [...this.state.formData[section]];
    updatedArray[index] = value;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleArrayAdd(section: string, newItem: string) {
    const updatedArray = [...this.state.formData[section], newItem];
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleArrayRemove(section: string, index: number) {
    const updatedArray = this.state.formData[section].filter(
      (_: any, i: any) => i !== index
    );
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleContactChange = (key, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          [key]: value,
        },
      },
    }));
  };

  handleSocialLinkChange = (platform, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          socials: {
            ...prevState.formData.contact.socials,
            [platform]: value,
          },
        },
      },
    }));
  };

  handleSocialLinkAdd = () => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          socials: {
            ...prevState.formData.contact.socials,
            NewPlatform: "",
          },
        },
      },
    }));
  };

  handleSocialLinkRemove = (platform) => {
    this.setState((prevState) => {
      const updatedSocials = { ...prevState.formData.contact.socials };
      delete updatedSocials[platform];
      return {
        formData: {
          ...prevState.formData,
          contact: {
            ...prevState.formData.contact,
            socials: updatedSocials,
          },
        },
      };
    });
  };

  handleSubmit() {
    const { updatePortfolio } = this.context;
    const { formData } = this.state;
    const { navigate } = this.props;

    updatePortfolio(formData);
    navigate("/preview");
  }

  render() {
    const { formData } = this.state;
    const isUserCreatingPortfolio = this.props.location.pathname === "/create";

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
              value={formData?.about?.name || ""}
              onChange={(e) =>
                this.handleInputChange("about", "name", e.target.value)
              }
            />
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded"
              placeholder="Tagline"
              value={formData?.about?.tagline || ""}
              onChange={(e) =>
                this.handleInputChange("about", "tagline", e.target.value)
              }
            />
            <textarea
              className="w-full mt-2 p-2 border rounded"
              placeholder="Description"
              value={formData?.about?.description || ""}
              onChange={(e) =>
                this.handleInputChange("about", "description", e.target.value)
              }
            />
          </section>

          {/* Skills Section */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
            {formData?.skills?.map((skill, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={skill}
                  onChange={(e) =>
                    this.handleArrayChange("skills", index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => this.handleArrayRemove("skills", index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => this.handleArrayAdd("skills", "")}
            >
              Add Skill
            </button>
          </section>

          {/* Projects Section */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
            {formData?.projects?.map((project, index) => (
              <div key={index} className="mt-4 p-4 border rounded">
                <input
                  type="text"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) =>
                    this.handleArrayChange("projects", index, {
                      ...project,
                      title: e.target.value,
                    })
                  }
                />
                <textarea
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) =>
                    this.handleArrayChange("projects", index, {
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
                  onChange={(e) =>
                    this.handleArrayChange("projects", index, {
                      ...project,
                      link: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="mt-2 text-red-500"
                  onClick={() => this.handleArrayRemove("projects", index)}
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() =>
                this.handleArrayAdd("projects", {
                  title: "",
                  description: "",
                  link: "",
                })
              }
            >
              Add Project
            </button>
          </section>
          <section className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Contact</h3>

            {/* Email Input */}
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded"
              placeholder="Email"
              value={this.state.formData?.contact?.email || ""}
              onChange={(e) =>
                this.handleContactChange("email", e.target.value)
              }
            />

            {/* Phone Input */}
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded"
              placeholder="Phone"
              value={this.state.formData?.contact?.phone || ""}
              onChange={(e) =>
                this.handleContactChange("phone", e.target.value)
              }
            />

            {/* Social Links Section */}
            <h4 className="text-lg font-semibold text-gray-800 mt-4">
              Social Links
            </h4>
            {Object.entries(this.state.formData?.contact?.socials || {}).map(
              ([platform, link], index) => (
                <div key={index} className="flex items-center mt-2">
                  {/* Platform Display */}
                  <input
                    type="text"
                    className="w-1/3 p-2 border rounded"
                    placeholder="Platform (e.g., LinkedIn)"
                    value={platform}
                    readOnly
                  />

                  {/* Link Input */}
                  <input
                    type="text"
                    className="w-2/3 ml-2 p-2 border rounded"
                    placeholder="URL (e.g., https://linkedin.com/in/username)"
                    value={link}
                    onChange={(e) =>
                      this.handleSocialLinkChange(platform, e.target.value)
                    }
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => this.handleSocialLinkRemove(platform)}
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            {/* Add New Social Link */}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={this.handleSocialLinkAdd}
            >
              Add Social Link
            </button>
          </section>

          {/* Save Button */}
          <section className="flex justify-end">
            <button
              type="button"
              className="px-6 py-2 bg-green-500 text-white rounded"
              onClick={this.handleSubmit}
            >
              {isUserCreatingPortfolio ? "Create Portfolio" : "Save Changes"}
            </button>
          </section>
        </form>
      </div>
    );
  }
}

export default WithNavigation(EditPortfolioClass);
