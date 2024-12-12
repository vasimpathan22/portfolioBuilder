import { Component } from "react";
import { WithNavigation } from "../navigator/WithNavigation";
import {
  PortfolioContext,
  portfolioContextType,
} from "../context/PortfolioContext";
import portfolioService from "../service/portfolioService";
import { Experience, Portfolio, Project } from "../types/types";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import { Add, ArrowBack, Delete } from "@mui/icons-material";
import { NavigateFunction, Location } from "react-router-dom";

type EditPortfolioProps = {
  navigate?: NavigateFunction;
  location?: Location;
};

type ValidationErrors = {
  [key: string]: string;
};

type stateProps = {
  formData: Portfolio;
  validationErrors: ValidationErrors;
};

class EditPortfolio extends Component<EditPortfolioProps, stateProps> {
  static contextType = PortfolioContext;
  declare context: portfolioContextType;

  constructor(props: EditPortfolioProps) {
    super(props);

    this.state = {
      formData: portfolioService.getLocalStoragePortfolio(),
      validationErrors: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleArrayChange = this.handleArrayChange.bind(this);
    this.handleArrayAdd = this.handleArrayAdd.bind(this);
    this.handleArrayRemove = this.handleArrayRemove.bind(this);
    this.handleSocialLinkChange = this.handleSocialLinkChange.bind(this);
    this.handleSocialLinkRemove = this.handleSocialLinkRemove.bind(this);
    this.handleSocialLinkAdd = this.handleSocialLinkAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.validateFieldsBeforeSubmitting =
      this.validateFieldsBeforeSubmitting.bind(this);
    this.handleSocialPlatformNameChange =
      this.handleSocialPlatformNameChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  validateFieldsBeforeSubmitting(): boolean {
    const { formData } = this.state;
    const errors: ValidationErrors = {};

    if (!formData.about?.name) {
      errors["name"] = "Name is required.";
    }

    if (!formData.about?.description) {
      errors["description"] = "Description is required.";
    }

    if (!formData.contact.email) {
      errors["email"] = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      errors["email"] = "Invalid email format.";
    }

    if (!formData.contact.phone) {
      errors["phone"] = "Phone is required.";
    } else if (!/^\d{10}$/.test(formData.contact.phone)) {
      errors["phone"] = "Phone number must be 10 digits.";
    }

    formData.skills.forEach((skill, index) => {
      if (!skill) {
        errors[`skill${index + 1}`] = `Skill ${index + 1} is required.`;
      }
    });

    formData.projects.forEach((project, index) => {
      if (!project.link) {
        errors[`project${index + 1}`] = `Project link is required.`;
      } else if (!/^https?:\/\/.+$/.test(project.link)) {
        errors[`project${index + 1}`] = `Invalid Project link format.`;
      }
    });

    formData.experiences.forEach((experience, index) => {
      if (!experience.companyName) {
        errors[`companyName${index + 1}`] = "Company name is required.";
      } else if (!experience.jobRole) {
        errors[`jobRole${index + 1}`] = "Job role is required.";
      } else if (!experience.jobDuration) {
        errors[`jobDuration${index + 1}`] = "Job duration is required.";
      } else if (!experience.jobDescription) {
        errors[`jobDescription${index + 1}`] = "Job description is required.";
      }
    });

    Object.entries(formData.contact.socials).forEach(([platform, link]) => {
      if (!link) {
        errors[`${platform}_link`] = `Link for platform is required.`;
      } else if (!/^https?:\/\/.+$/.test(link)) {
        errors[`${platform}_link`] = `Invalid URL format for platform.`;
      }
    });

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0; // Return true if no errors
  }

  handleInputChange<K extends keyof Portfolio, F extends keyof Portfolio[K]>(
    section: K,
    key: F,
    value: Portfolio[K][F]
  ) {
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

  handleArrayChange<K extends "skills" | "projects" | "experiences">(
    section: K,
    index: number,
    value: K extends "skills"
      ? string
      : K extends "projects"
      ? Project
      : Experience
  ) {
    const updatedArray = [...this.state.formData[section]];
    updatedArray[index] = value;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleArrayAdd<K extends "skills" | "projects" | "experiences">(
    section: K,
    elementToAdd: K extends "skills"
      ? string
      : K extends "projects"
      ? Project
      : Experience
  ) {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: [...prevState.formData[section], elementToAdd],
      },
    }));
  }

  handleArrayRemove<K extends "skills" | "projects" | "experiences">(
    section: K,
    indexToRemove: number
  ) {
    const updatedArray = this.state.formData[section].filter(
      (_, index) => index !== indexToRemove
    );
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [section]: updatedArray,
      },
    }));
  }

  handleSocialLinkChange(platform: string, value: string) {
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
  }

  handleSocialLinkAdd() {
    const defaultPlatformName = `newPlatform_${Date.now()
      .toString()
      .substring(6)}`;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        contact: {
          ...prevState.formData.contact,
          socials: {
            ...prevState.formData.contact.socials,
            [defaultPlatformName]: "",
          },
        },
      },
    }));
  }

  handleSocialLinkRemove(platform: string) {
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
  }

  handleSocialPlatformNameChange(oldPlatform: string, newPlatform: string) {
    this.setState((prevState) => {
      const socials = { ...prevState.formData.contact.socials };

      if (socials[newPlatform]) {
        console.error("Platform already exists");
        alert("Platform already exists");
        return null;
      }
      socials[newPlatform] = socials[oldPlatform];
      delete socials[oldPlatform];
      return {
        formData: {
          ...prevState.formData,
          contact: {
            ...prevState.formData.contact,
            socials: socials,
          },
        },
      };
    });
  }

  handleClearForm() {
    this.setState({ formData: portfolioService.resetPortfolio() });
  }

  handleSubmit() {
    if (this.validateFieldsBeforeSubmitting()) {
      const { updatePortfolio } = this.context;
      const { formData } = this.state;
      const { navigate } = this.props;

      updatePortfolio(formData);
      navigate?.("/preview");
    }
  }

  handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const errors: ValidationErrors = {};

    if (name === "name" && !value) {
      errors["name"] = "Name is required.";
    } else if (name === "description" && !value) {
      errors["description"] = "Description is required.";
    } else if (name === "email") {
      if (!value) {
        errors["email"] = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors["email"] = "Invalid email format.";
      }
    } else if (name === "phone") {
      if (!value) {
        errors["phone"] = "Phone number is required.";
      } else if (!/^\d{10}$/.test(value)) {
        errors["phone"] = "Invalid phone number format.";
      }
    } else if (name.includes("skill")) {
      if (!value) {
        errors[name] = `${name} is required.`;
      }
    } else if (name.includes("project")) {
      if (!value) {
        errors[name] = `Link for ${name} is requiured`;
      } else if (!/^https?:\/\/.+$/.test(value)) {
        errors[name] = `Link for ${name} is invalid`;
      }
    } else if (name.includes("link")) {
      if (!value) {
        errors[name] = `${name} is required.`;
      } else if (!/^https?:\/\/.+$/.test(value)) {
        errors[name] = `${name} is invalid.`;
      }
    } else if (name.includes("companyName")) {
      if (!value) {
        errors[name] = "Company name is required.";
      }
    } else if (name.includes("jobDuration")) {
      if (!value) {
        errors[name] = "Job duration is required.";
      }
    } else if (name.includes("jobDescription")) {
      if (!value) {
        errors[name] = "Job description is required.";
      }
    } else if (name.includes("jobRole")) {
      if (!value) {
        errors[name] = "Job role is required.";
      }
    }

    this.setState({ validationErrors: errors });
  }

  handleGoBack() {
    const { navigate } = this.props;
    navigate?.("/preview");
  }

  render() {
    const { formData, validationErrors } = this.state;
    const isUserCreatingPortfolio = this.props.location?.pathname === "/create";
    const isAddSkillButtonDisable =
      formData.skills.length > 0 &&
      !formData.skills[formData.skills.length - 1];
    const isAddProjectButtonDisable =
      formData.projects.length > 0 &&
      !formData.projects[formData.projects.length - 1].link;
    const isAddExperienceButtonDisable =
      formData.experiences.length > 0 &&
      !formData.experiences[formData.experiences.length - 1].jobDescription;
    const isAddSocialLinkButtonDisable =
      !formData.contact.socials[
        Object.keys(formData.contact.socials)[
          Object.keys(formData.contact.socials).length - 1
        ]
      ];

    return (
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          p: 3,
          bgcolor: "#f4f6f8",
          borderRadius: 3,
          boxShadow: 4,
          mt: 4,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={this.handleGoBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom>
          {isUserCreatingPortfolio ? "Create Resume" : "Edit Resume"}
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* About Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.about?.name || ""}
                onChange={(e) =>
                  this.handleInputChange("about", "name", e.target.value)
                }
                onBlur={this.handleBlur}
                error={!!validationErrors["name"]}
                helperText={validationErrors["name"]}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tagline"
                name="tagline"
                value={formData.about?.tagline || ""}
                onChange={(e) =>
                  this.handleInputChange("about", "tagline", e.target.value)
                }
              />
              <TextField
                fullWidth
                margin="normal"
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.about?.description || ""}
                onChange={(e) =>
                  this.handleInputChange("about", "description", e.target.value)
                }
                onBlur={this.handleBlur}
                error={!!validationErrors["description"]}
                helperText={validationErrors["description"]}
              />
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Skills
              </Typography>
              {formData.skills.map((skill, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Skill ${index + 1}`}
                    name={`skill${index + 1}`}
                    value={skill}
                    onChange={(e) =>
                      this.handleArrayChange("skills", index, e.target.value)
                    }
                    onBlur={this.handleBlur}
                    helperText={validationErrors[`skill${index + 1}`]}
                    error={!!validationErrors[`skill${index + 1}`]}
                  />
                  <IconButton
                    sx={{ ml: 1 }}
                    color="error"
                    onClick={() => this.handleArrayRemove("skills", index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => this.handleArrayAdd("skills", "")}
                disabled={isAddSkillButtonDisable}
              >
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Projects
              </Typography>
              {formData.projects.map((project, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Project Title"
                    value={project.title}
                    onChange={(e) =>
                      this.handleArrayChange("projects", index, {
                        ...project,
                        title: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    label="Project Description"
                    value={project.description}
                    onChange={(e) =>
                      this.handleArrayChange("projects", index, {
                        ...project,
                        description: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Project Link"
                    type="url"
                    required
                    name={`project${index + 1}`}
                    value={project.link}
                    onChange={(e) =>
                      this.handleArrayChange("projects", index, {
                        ...project,
                        link: e.target.value,
                      })
                    }
                    onBlur={this.handleBlur}
                    error={!!validationErrors[`project${index + 1}`]}
                    helperText={validationErrors[`project${index + 1}`] || ""}
                  />
                  <IconButton
                    color="error"
                    onClick={() => this.handleArrayRemove("projects", index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  this.handleArrayAdd("projects", {
                    title: "",
                    description: "",
                    link: "",
                  })
                }
                disabled={isAddProjectButtonDisable}
              >
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Experiences Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Experiences
              </Typography>
              {formData?.experiences?.map((experience, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Company Name"
                    required
                    value={experience.companyName}
                    name={`companyName${index + 1}`}
                    onChange={(e) =>
                      this.handleArrayChange("experiences", index, {
                        ...experience,
                        companyName: e.target.value,
                      })
                    }
                    onBlur={this.handleBlur}
                    error={!!validationErrors[`companyName${index + 1}`]}
                    helperText={
                      validationErrors[`companyName${index + 1}`] || ""
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Job Duration"
                    required
                    value={experience.jobDuration}
                    name={`jobDuration${index + 1}`}
                    onChange={(e) =>
                      this.handleArrayChange("experiences", index, {
                        ...experience,
                        jobDuration: e.target.value,
                      })
                    }
                    onBlur={this.handleBlur}
                    error={!!validationErrors[`jobDuration${index + 1}`]}
                    helperText={
                      validationErrors[`jobDuration${index + 1}`] || ""
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Job Role"
                    required
                    name={`jobRole${index + 1}`}
                    value={experience.jobRole}
                    onChange={(e) =>
                      this.handleArrayChange("experiences", index, {
                        ...experience,
                        jobRole: e.target.value,
                      })
                    }
                    onBlur={this.handleBlur}
                    error={!!validationErrors[`jobRole${index + 1}`]}
                    helperText={validationErrors[`jobRole${index + 1}`] || ""}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    name={`jobDescription${index + 1}`}
                    label="Job Description"
                    required
                    value={experience.jobDescription}
                    onChange={(e) =>
                      this.handleArrayChange("experiences", index, {
                        ...experience,
                        jobDescription: e.target.value,
                      })
                    }
                    onBlur={this.handleBlur}
                    error={!!validationErrors[`jobDescription${index + 1}`]}
                    helperText={validationErrors[`jobDescription${index + 1}`]}
                  />
                  <IconButton
                    color="error"
                    onClick={() => this.handleArrayRemove("experiences", index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  this.handleArrayAdd("experiences", {
                    companyName: "",
                    jobDuration: "",
                    jobRole: "",
                    jobDescription: "",
                  })
                }
                disabled={isAddExperienceButtonDisable}
              >
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Contact
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                required
                name="email"
                value={formData.contact.email || ""}
                onChange={(e) =>
                  this.handleInputChange("contact", "email", e.target.value)
                }
                onBlur={this.handleBlur}
                error={!!validationErrors["email"]}
                helperText={validationErrors["email"]}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                type="tel"
                required
                name="phone"
                value={formData.contact.phone || ""}
                onChange={(e) =>
                  this.handleInputChange("contact", "phone", e.target.value)
                }
                onBlur={this.handleBlur}
                error={!!validationErrors["phone"]}
                helperText={validationErrors["phone"]}
              />
              <Typography variant="subtitle1" gutterBottom>
                Social Links
              </Typography>
              {Object.entries(formData.contact.socials).map(
                ([platform, link], index) => {
                  const mandatoryPlatform =
                    platform.toLowerCase() === "github" ||
                    platform.toLowerCase() === "linkedin";
                  return (
                    <Box key={index} sx={{ display: "flex", mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Platform"
                        value={platform}
                        InputProps={{ readOnly: mandatoryPlatform }}
                        onChange={(e) =>
                          !mandatoryPlatform &&
                          this.handleSocialPlatformNameChange(
                            platform,
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        fullWidth
                        sx={!mandatoryPlatform ? { ml: 2 } : { mr: 5, ml: 2 }}
                        label="Link"
                        type="url"
                        required
                        name={`${platform}_link`}
                        value={link}
                        onChange={(e) =>
                          this.handleSocialLinkChange(platform, e.target.value)
                        }
                        onBlur={this.handleBlur}
                        error={!!validationErrors[`${platform}_link`]}
                        helperText={validationErrors[`${platform}_link`]}
                      />
                      {!mandatoryPlatform && (
                        <IconButton
                          color="error"
                          onClick={() => this.handleSocialLinkRemove(platform)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  );
                }
              )}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={this.handleSocialLinkAdd}
                disabled={isAddSocialLinkButtonDisable}
              >
                Add Social Link
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={this.handleClearForm}
              sx={{ mr: 2 }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              {isUserCreatingPortfolio ? "Create Portfolio" : "Save Changes"}
            </Button>
          </CardActions>
        </form>
      </Box>
    );
  }
}

const EditPortfolioWithNavigation = WithNavigation(EditPortfolio);

export default EditPortfolioWithNavigation;
