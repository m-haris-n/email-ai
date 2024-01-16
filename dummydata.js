const framework1 = `Subject: Observation
   Message:
   Hey (first name),
   Personalisation line (some observation about business or decision maker)
   Link observation to pain business is solving Impact line (what impact this is having for the business)
   Link impact to how company can solve this problem
   Call to action\n
   `;

const framework2 = `
Subject: ((account trigger))
Hey ((firstname)),
You recently ((trigger)). ((recognition))
What we often see with ((industry)) is that ((business impact related to trigger))
The challenge ((business challenge & root cause)).
((validating question))
Cheers / Best / Regards,
\n
`;

export const frameworks = [
   { label: "Chris Ritson Framework", value: framework1 },
   { label: "Chistian Krause framework", value: framework2 },
];

export const fields = [
   {
      key: 1,
      labelName: "Product the company is trying to promote",
      valueName: "productDescription",
      required: true,
   },
   {
      key: 2,
      labelName: "Problem the product/service solves",
      valueName: "problemTheProductSolves",
      required: true,
   },
   {
      key: 3,
      labelName: "Unique selling point of the product/service",
      valueName: "uniqueSellingPoint",
      required: true,
   },
];

export const iframecode = `<iframe src="https://email-ai-three.vercel.app/form"
        style="border:0px #ffffff none;" name="myiFrame"
        scrolling="no" frameborder="1" marginheight="0px"
        marginwidth="0px" height="400px" width="600px"
        allowfullscreen>
</iframe>`;
