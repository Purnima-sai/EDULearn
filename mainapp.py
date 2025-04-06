from flask import Flask, request, redirect, url_for, session, render_template, flash
from werkzeug.security import generate_password_hash, check_password_hash
import os # Needed for secret key generation

app = Flask(__name__)

# --- IMPORTANT: Secret Key for Sessions ---
# You NEED a secret key for sessions to work.
# In production, use a truly random, secret value, often set via environment variables.
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'a_default_development_secret_key') # Example

# --- Dummy User Storage (Replace with a real database!) ---
# This is just for demonstration. In a real app, you'd use SQLAlchemy, Peewee, etc.
users_db = {} # Store user data like: {'email@example.com': {'username': 'User', 'password_hash': 'hashed_pw', 'id': 1}}
next_user_id = 1

# --- Routes ---

@app.route('/')
def index():
    # Simple home page
    return "<h1>Home Page</h1><p><a href='/signup'>Sign Up</a> | <a href='/login'>Login</a></p>"

# --- Signup ---
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    global next_user_id # Allow modification of the global variable

    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # --- Basic Validation (Add more!) ---
        if not username or not email or not password:
            flash('Please fill out all fields.', 'error')
            return redirect(url_for('signup'))

        # --- Check if user already exists (using our dummy DB) ---
        if email in users_db:
            flash('Email address already registered.', 'error')
            return redirect(url_for('signup'))

        # --- Hash Password ---
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        # --- Store New User (in our dummy DB) ---
        user_id = next_user_id
        users_db[email] = {
            'id': user_id,
            'username': username,
            'password_hash': hashed_password
        }
        next_user_id += 1
        print(f"Debug: New user stored: {users_db[email]}") # For checking

        # --- Signup Successful ---
        # 1. Log the user in immediately by creating a session
        session['user_id'] = user_id
        session['username'] = username
        session['user_email'] = email # You might store email too

        # 2. Flash a success message
        flash(f'Welcome, {username}! Your account has been created.', 'success')

        # 3. *** REDIRECT TO THE WELCOME PAGE ***
        print(f"User {username} signed up successfully. Redirecting to welcome...")
        return redirect(url_for('welcome')) # Redirects to the '/welcome' route

    # If GET request, just show the signup form
    # Create a simple signup.html template later
    return render_template('signup_form.html') # We'll need this template

# --- Login ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # --- Basic Validation ---
        if not email or not password:
            flash('Please enter both email and password.', 'error')
            return redirect(url_for('login'))

        # --- Find User (in our dummy DB) ---
        user = users_db.get(email)
        print(f"Debug: Attempting login for {email}. User found: {user is not None}")

        # --- Check Password ---
        if user and check_password_hash(user['password_hash'], password):
            # --- Login Successful ---
            # 1. Create the session
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['user_email'] = email

            # 2. Flash a success message
            flash(f'Welcome back, {user["username"]}!', 'success')

            # 3. *** REDIRECT TO THE WELCOME PAGE ***
            print(f"User {user['username']} logged in successfully. Redirecting to welcome...")
            return redirect(url_for('welcome')) # Redirects to the '/welcome' route

        else:
            # --- Login Failed ---
            flash('Invalid email or password.', 'error')
            print(f"Login failed for {email}.")
            return redirect(url_for('login')) # Send them back to the login form

    # If GET request, just show the login form
    # Create a simple login.html template later
    return render_template('login_form.html') # We'll need this template

# --- Welcome Page ---
@app.route('/welcome')
def welcome():
    return render_template('welcome.html')

# --- Logout ---
@app.route('/logout')
def logout():
    # Clear the session
    session.pop('user_id', None)
    session.pop('username', None)
    session.pop('user_email', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login')) # Redirect to login page after logout
@app.route('/courses')
def courses():
    # Add logic to check if user is logged in
    if 'user_id' not in session:
        flash('You need to be logged in to see that page.', 'warning')
        return redirect(url_for('login'))
    # Render a courses.html template (which you'll need to create)
    return render_template('courses.html') # Or return "Courses Page Coming Soon!"

@app.route('/about')
def about():
     # Render an about.html template (which you'll need to create)
    return render_template('about.html') # Or return "About Us Page Coming Soon!"

@app.route('/pomodoro')
def pomodoro():
     if 'user_id' not in session:
         flash('You need to be logged in to use the timer.', 'warning')
         return redirect(url_for('login'))
     # Render a pomodoro.html template
     return render_template('pomodoro.html') # Or return "Pomodoro Page Coming Soon!"

@app.route('/studyplanner')
def studyplanner():
     if 'user_id' not in session:
         flash('You need to be logged in to use the planner.', 'warning')
         return redirect(url_for('login'))
     # Render a studyplanner.html template
     return render_template('studyplanner.html') # Or return "Study Planner Page Coming Soon!"

# Make sure you have an index route if needed for the first nav link
@app.route('/')
def index():
    # Check if user logged in, maybe redirect to welcome or show landing page
    if 'user_id' in session:
         return redirect(url_for('welcome'))
    # Otherwise render a public landing page template if you have one
    return render_template('landing_page.html') # Or just "Public Home"
# --- Template Rendering Setup (Basic) ---
# Create a 'templates' folder in the same directory as your app.py
# Add these basic HTML files inside 'templates':

# templates/base.html (optional, but good practice for layout)
# templates/signup_form.html
# templates/login_form.html
# templates/welcome.html

# You'll need to display flashed messages in your templates, usually in a base template:
# {% with messages = get_flashed_messages(with_categories=true) %}
#   {% if messages %}
#     <ul class=flashes>
#     {% for category, message in messages %}
#       <li class="{{ category }}">{{ message }}</li>
#     {% endfor %}
#     </ul>
#   {% endif %}
# {% endwith %}

if __name__ == '__main__':
    app.run(debug=True)  # Or maybe just app.run()