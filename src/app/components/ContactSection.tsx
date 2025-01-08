import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="bg-white bg-no-repeat py-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="md:w-2/3 w-full bg-white p-8">
            <h1 className="text-4xl md:text-5xl font-medium text-primary mb-6 text-center">
              Kontakti
            </h1>

            <form
              name="contactform"
              action="send_form_email.php"
              method="post"
              id="contact_form"
              className="space-y-4"
            >
              {/* First Name */}
              <div className="flex items-center justify-between space-x-4">
                <div className='w-1/2'>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="Emri"
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Last Name */}
                <div className='w-1/2'>
                  <input
                    name="last_name"
                    type="text"
                    placeholder="Mbiemri"
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4">
                {/* Email */}
                <div className='w-1/2'>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Phone */}
                <div className='w-1/2'>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Telefoni"
                    className="w-full p-3 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="comments"
                  placeholder="Mesazhi"
                  className="w-full p-3 border border-primary h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-12 rounded-md hover:bg-[#7a6a2c] transition duration-300"
                >
                  Dërgo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
