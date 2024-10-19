import reflex as rx
from reflex.style import toggle_color_mode
from rxconfig import config


class State(rx.State):
   """The app state."""
   charity_name: str = ""
   grant_results: list = []
   active_tab = "search_grants"


   def update_charity_name(self, new_value: str):
       self.charity_name = new_value


   def submit_charity(self):
       print(f"Charity submitted: {self.charity_name}")


   def search_grants(self):
       self.grant_results = [
           "Grant A - $5000",
           "Grant B - $10000",
           "Grant C - $2000",
       ]

class FormState(rx.State):
   form_data: dict = {}

   def handle_submit(self, form_data: dict):
       """Handle the form submit."""
       self.form_data = form_data

def form_example():
   return rx.vstack(
       rx.form(
           rx.vstack(
               rx.input(
                   placeholder="First Name",
                   name="first_name",
               ),
               rx.input(
                   placeholder="Last Name",
                   name="last_name",
               ),
               rx.hstack(
                   rx.checkbox("Checked", name="check"),
                   rx.switch("Switched", name="switch"),
               ),
               rx.button("Submit", type="submit"),
           ),
           on_submit=FormState.handle_submit,
           reset_on_submit=True,
       ),
       rx.divider(),
       rx.heading("Results"),
       rx.text(FormState.form_data.to_string()),
   )


def navbar_link(text: str, url: str) -> rx.Component:
   return rx.link(
       rx.text(text, size="4", weight="medium"), href=url
   )




def navbar() -> rx.Component:
   return rx.box(
       rx.desktop_only(
           rx.hstack(
               rx.hstack(
                   rx.image(
                       src="/GrantHope_logo.png",
                       width="2.25em",
                       height="auto",
                       border_radius="25%",
                   ),
                   rx.heading(
                       "GrantHope", size="7", weight="bold", font="Lato"
                   ),
                   align_items="center",
               ),
               rx.hstack(
                   navbar_link("Home", "/#"),
                   navbar_link("About", "/#"),
                   navbar_link("Pricing", "/#"),
                   navbar_link("Contact", "/#"),
                   justify="end",
                   spacing="5",
               ),
               justify="between",
               align_items="center",
           ),
       ),
       rx.mobile_and_tablet(
           rx.hstack(
               rx.hstack(
                   rx.image(
                       src="/GrantHope_logo.png",
                       width="2em",
                       height="auto",
                       border_radius="25%",
                   ),
                   rx.heading(
                       "Reflex", size="6", weight="bold"
                   ),
                   align_items="center",
               ),
               rx.menu.root(
                   rx.menu.trigger(
                       rx.icon("menu", size=30)
                   ),
                   rx.menu.content(
                       rx.menu.item("Home"),
                       rx.menu.item("About"),
                       rx.menu.item("Pricing"),
                       rx.menu.item("Contact"),
                   ),
                   justify="end",
               ),
               justify="between",
               align_items="center",
           ),
       ),
       bg=rx.color("accent", 3),
       padding="1em",
       position="absolute",  # Set position to absolute to ensure it sticks to the top
       top="0px",  # Ensure it's placed at the very top
       left="0px",
       width="100%",
       z_index="5",  # Ensure it stays on top of other elements
   )


def index() -> rx.Component:
   # Welcome Page (Index)
   return rx.container(
       rx.vstack(
           navbar(),  # Add navbar
           rx.heading("Welcome to the Charity AI Platform!", size="9", color="#007bff", text_align="center"),
           rx.text(
               "Let us automate your charity and find grants you need",
               size="5",
               color="#000000",
               text_align="center",
               font_weight="bold"
           ),
           rx.text("Get started by managing your charity and finding grants.", color="#343a40", text_align="center"),
           spacing="5",
           justify="center",
           min_height="85vh",
       ),
       rx.logo(),
       rx.vstack(
           rx.heading("Submit Your Charity Idea", size="6", color="#007bff", text_align="center"),
           rx.input(
               placeholder="Enter your charity name...",
               value=State.charity_name,
               on_change=State.update_charity_name,
               background="#f8f9fa",
               color="#343a40",
           ),
           rx.button("Submit", on_click=State.submit_charity, background="#28a745", color="white"),
           spacing="4",
       ),
       rx.vstack(
           rx.heading("Search for Grants", size="6", color="#007bff", text_align="center"),
           rx.button("Search Grants", on_click=State.search_grants, background="#28a745", color="white"),
           rx.vstack(
               rx.foreach(State.grant_results, lambda grant: rx.text(grant, color="#343a40")),
               spacing="2",
           ),
           spacing="4",
       ),
       background = "#ffffff"
   )


def navbar_link(text: str, url: str) -> rx.Component:
   return rx.link(
       rx.text(text, size="4", weight="medium"), href=url
   )


app = rx.App(state=State)
app.add_page(index)
