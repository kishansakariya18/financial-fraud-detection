import clsx from "clsx";
import { useForm } from "react-hook-form";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { Page } from "components/shared/Page";
import { Button, Card, Input, Radio } from "components/ui";
import { useEffect, useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import EmailTemplateService from "services/email-template.services";
import { useParams } from "react-router";
import { emailTemplateDetailResponseMapper } from "./helper";

const EditEmailTemplate = () => {
  const { emailTemplateId } = useParams();
  const { t } = useTranslation();

  const pageTitle = t("edit") + " " + t("email-template");
  const title = t("title");
  const slug = t("slug");
  const heading = t("heading");
  const to = t("to");
  const cc = t("cc");
  const bcc = t("bcc");
  const update = t("update");
  const template = t("template");
  const status = t("status");

  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [contentData, setcontentData] = useState(null);
  const [slugText, setSlugText] = useState("");

  const fetchEmailTemplate = async (emailTemplateID) => {
    setIsLoading(true);
    const result =
      await EmailTemplateService.emailTemplateDetail(emailTemplateID);
    if (result) {
      if (result.status === 200) {
        const apiData = result.response.data;
        const resultData = emailTemplateDetailResponseMapper(apiData);
        setResponse(resultData);

        setSlugText(resultData.slug);
      } else {
        setError(result.error);
      }
    } else {
      setResponse([]);
    }
    setIsLoading(false);
  };

  // TODO: remove below code and implement loader
  if (!isLoading && error) {
    // toast.error(detailError, config.TOAST_UI);
    setError(null);
  }
  if (!isLoading && !error && response) {
    // toast.success(detail.message, config.TOAST_UI);
  }

  useEffect(() => {
    fetchEmailTemplate(emailTemplateId);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const reqBody = {
      ...data,
      slug: slugText,
    };
    console.log("data::", data);

    if (!contentData) {
      toast("Please provide template data", {
        invert: true,
      });
      return;
    }
    reqBody.template = contentData;
    reqBody.emailTemplateID = emailTemplateId;

    setSubmitLoading(true);
    const result = await EmailTemplateService.emailTemplateUpdate(reqBody);

    if (result) {
      if (result.status === 200 || result.status === 201) {
        setSubmitResponse(result.response);
      } else {
        setSubmitError(result.error);
      }
    } else {
      setSubmitError(result.error);
    }
    setSubmitLoading(false);
  };

  if (!isSubmitLoading && submitError) {
    toast(submitError, {
      invert: true,
    });
    setSubmitError(null);
  }
  if (!isSubmitLoading && !submitError && submitResponse) {
    toast("Email template updated successfully", {
      invert: true,
    });
    setSubmitResponse(null);
    reset();
  }

  const handleSlug = (e) => {
    let value = e.target.value.trim();
    console.log("e.current:", value);

    value = value.split(" ").join("-");
    setSlugText(value);
  };

  return (
    <Page title={pageTitle}>
      {response && !isLoading && (
        <div className="transition-content px-[--margin-x] pb-6">
          <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
            <div className="flex items-center gap-1">
              <DocumentPlusIcon className="size-6" />
              <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
                {pageTitle}
              </h2>
            </div>
          </div>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            id="add-email-template"
          >
            <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
              <div className="col-span-12">
                <Card className="p-4 sm:px-5">
                  <div className="mt-5 space-y-5">
                    <Input
                      id="title"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      type="text"
                      name="title"
                      label={title}
                      placeholder="Enter Title"
                      defaultValue={response.title}
                      {...register("title", {
                        required: "Title is required",
                      })}
                      error={errors?.title?.message}
                      onChange={handleSlug}
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <Input
                      id="slug"
                      className="form-control"
                      type="text"
                      name="slug"
                      placeholder="Slug"
                      value={slugText}
                      label={slug}
                      disabled
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <Input
                      id="heading"
                      className={`form-control ${errors.heading ? "is-invalid" : ""}`}
                      type="text"
                      name="heading"
                      label={heading}
                      defaultValue={response.heading}
                      placeholder="Enter Heading"
                      {...register("heading", {
                        required: "Heading is required",
                      })}
                      error={errors?.heading?.message}
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <div className="form-group col-md-12">
                      <span>{template}</span>
                      <CKEditor
                        editor={ClassicEditor}
                        data={response.template}
                        onReady={() => {
                          setcontentData(response.template);
                        }}
                        config={{
                          licenseKey: "GPL",
                          toolbar: [
                            "paragraph",
                            "heading",
                            "|", // Added paragraph and heading at the start
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "subscript",
                            "superscript",
                            "|",
                            "alignment",
                            "fontSize",
                            "fontFamily",
                            "fontColor",
                            "fontBackgroundColor",
                            "|",
                            "bulletedList",
                            "numberedList",
                            "outdent",
                            "indent",
                            "|",
                            "link",
                            "blockQuote",
                            "insertTable",
                            "|",
                            "undo",
                            "redo",
                          ],
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setcontentData(data);
                        }}
                      ></CKEditor>
                    </div>
                  </div>
                  <div className="mt-5 space-y-5">
                    <Input
                      id="to"
                      className={`form-control ${errors.to ? "is-invalid" : ""}`}
                      type="text"
                      name="to"
                      label={to}
                      defaultValue={response.to}
                      placeholder="Enter To"
                      {...register("to", {
                        required: "to is required",
                      })}
                      error={errors?.to?.message}
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <Input
                      id="cc"
                      className={`form-control ${errors.cc ? "is-invalid" : ""}`}
                      type="text"
                      name="cc"
                      label={cc}
                      defaultValue={response.cc}
                      placeholder="Enter CC"
                      {...register("cc", {
                        required: "CC is required",
                      })}
                      error={errors?.cc?.message}
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <Input
                      id="bcc"
                      className={`form-control ${errors.bcc ? "is-invalid" : ""}`}
                      type="text"
                      name="bcc"
                      label={bcc}
                      defaultValue={response.bcc}
                      placeholder="Enter BCC"
                      {...register("bcc", {
                        required: "BCC is required",
                      })}
                      error={errors?.bcc?.message}
                    />
                  </div>
                  <div className="mt-5 space-y-5">
                    <span>{status}</span>
                    <div
                      className={clsx(
                        "!mt-1 flex space-x-4 rounded-lg border px-3 py-4",
                      )}
                    >
                      <Radio
                        label="Active"
                        defaultChecked={response.status == 'In Active' ? true : false}
                        {...register("status")}
                        value="1"
                      />
                      <Radio
                        label="Inactive"
                        defaultChecked={response.status == 'In Active' ? true : false}
                        {...register("status")}
                        value="0"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </form>
          <div className="flex !flex-row-reverse flex-col items-center space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
            <div className="flex gap-2">
              <Button
                className="min-w-[7rem]"
                color="primary"
                type="submit"
                form="add-email-template"
              >
                {update}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default EditEmailTemplate;
