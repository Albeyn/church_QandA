import { createClient } from '@supabase/supabase-js';
import churchLogo from '../churchlogo.png';
import './style.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const isConfigured = Boolean(supabaseUrl && supabaseKey);
const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

if (location.pathname === '/admin' || location.pathname === '/admin/') {
  renderAdmin();
} else {
document.querySelector('#app').innerHTML = `
  <main class="page-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Manifested Word Bride Assembly home">
        <span class="brand-logo-frame"><img class="brand-logo" src="${churchLogo}" alt="" /></span>
        <span class="brand-name">Manifested Word<br />Bride Assembly</span>
      </a>
      <span class="session-label"><span class="live-dot"></span> CHURCH Q&amp;A</span>
    </header>

    <section class="community-dashboard" aria-labelledby="community-dashboard-title">
      <div class="admin-dashboard-heading">
        <div>
          <p class="card-kicker">COMMUNITY DASHBOARD</p>
          <h2 id="community-dashboard-title">Question totals</h2>
        </div>
        <p id="public-stats-message" class="community-stats-message" aria-live="polite"></p>
      </div>
      <div class="stats-grid admin-stats" aria-label="Community question totals">
        <article class="stat-card">
          <span class="stat-label">Questions submitted</span>
          <strong id="public-submitted-count" class="stat-value" aria-live="polite">—</strong>
          <span class="stat-help">Anonymous questions from our community</span>
        </article>
        <article class="stat-card">
          <span class="stat-label">Questions answered</span>
          <strong id="public-answered-count" class="stat-value" aria-live="polite">—</strong>
          <span class="stat-help">Questions marked answered by the church</span>
        </article>
      </div>
    </section>

    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> A SPACE FOR HONEST QUESTIONS</p>
        <h1 id="page-title">You can ask<br />us <em>anything.</em></h1>
        <p class="intro">
          Faith brings big questions. Send yours in for our next church Q&amp;A —
          no name, no spotlight, just an honest conversation.
        </p>
        <div class="promise">
          <span class="promise-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6l-7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <p><strong>Completely anonymous.</strong><br />We don’t collect your name or email.</p>
        </div>
      </div>

      <section class="question-card" aria-labelledby="form-title">
        <div class="card-heading">
          <div>
            <p class="card-kicker">YOUR VOICE MATTERS</p>
            <h2 id="form-title">What’s on your mind?</h2>
          </div>
          <span class="question-mark" aria-hidden="true">?</span>
        </div>
        <div id="answer-date" class="answer-date" hidden>
          <span>Questions will be answered at church on</span>
          <time></time>
        </div>
        <p id="public-settings-message" class="form-message" aria-live="polite"></p>

        <div id="config-notice" class="config-notice" ${isConfigured ? 'hidden' : ''} role="status">
          Supabase isn’t connected yet. Add your project URL and anon key to
          <code>.env.local</code> to enable submissions.
        </div>

        <form id="question-form">
          <label for="topic">What’s it about?</label>
          <div class="select-wrap">
            <select id="topic" name="topic" required>
              <option value="" disabled selected>Choose a topic</option>
              <option>Faith &amp; life</option>
              <option>The Bible</option>
              <option>Church</option>
              <option>Other</option>
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>

          <div class="question-label-row">
            <label for="question">Your question</label>
            <span class="optional">8–1000 characters</span>
          </div>
          <textarea
            id="question"
            name="question"
            minlength="8"
            maxlength="1000"
            placeholder="There’s something I’ve been wondering about..."
            required
          ></textarea>
          <div class="form-footer">
            <span id="char-count" class="char-count">0 / 1000</span>
            <span class="anonymous-note">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              Anonymous
            </span>
          </div>

          <button id="submit-button" type="submit" ${isConfigured ? '' : 'disabled'}>
            <span id="button-label">Send your question</span>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <p id="form-message" class="form-message" aria-live="polite"></p>
        </form>

        <div id="success-panel" class="success-panel" hidden role="status">
          <span class="success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="m6 12 4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <h3>It’s been received.</h3>
          <p>Thanks for trusting us with your question. We’ll read it with care.</p>
          <button id="ask-another" class="text-button" type="button">Ask another question <span aria-hidden="true">↗</span></button>
        </div>

        <div class="card-note">
          <span aria-hidden="true">✳</span>
          Every question is welcome here. We’ll read each one with care.
        </div>
      </section>
    </section>

    <footer class="footer">
      <span>MADE FOR OPEN HEARTS &amp; OPEN CONVERSATIONS</span>
      <span class="footer-right">
        <a href="/admin">ADMIN</a>
        <span aria-hidden="true">↗</span>
      </span>
    </footer>
  </main>
`;

const form = document.querySelector('#question-form');
const questionInput = document.querySelector('#question');
const charCount = document.querySelector('#char-count');
const message = document.querySelector('#form-message');
const submitButton = document.querySelector('#submit-button');
const buttonLabel = document.querySelector('#button-label');
const successPanel = document.querySelector('#success-panel');

questionInput.addEventListener('input', () => {
  charCount.textContent = `${questionInput.value.length} / 1000`;
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  message.className = 'form-message';

  const question = questionInput.value.trim();
  const topic = document.querySelector('#topic').value;
  if (question.length < 8) {
    message.textContent = 'Please enter a question with at least 8 characters.';
    message.classList.add('is-error');
    questionInput.focus();
    return;
  }

  submitButton.disabled = true;
  buttonLabel.textContent = 'Sending…';

  try {
    const { error } = await supabase.from('questions').insert({ question, topic });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Question submission failed:', error);
    message.textContent = 'We couldn’t send your question just now. Please try again.';
    message.classList.add('is-error');
    submitButton.disabled = false;
    buttonLabel.textContent = 'Send your question';
    return;
  }

  form.hidden = true;
  successPanel.hidden = false;
  await loadPublicStats();
});

document.querySelector('#ask-another').addEventListener('click', () => {
  form.reset();
  charCount.textContent = '0 / 1000';
  message.textContent = '';
  submitButton.disabled = false;
  buttonLabel.textContent = 'Send your question';
  successPanel.hidden = true;
  form.hidden = false;
  questionInput.focus();
});

loadPublicSettings();
loadPublicStats();
}

async function loadPublicSettings() {
  if (!supabase) return;

  const message = document.querySelector('#public-settings-message');
  try {
    const { data, error } = await supabase
      .from('qna_settings')
      .select('id, guide_question, answer_date')
      .eq('id', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Public Q&A settings are not configured.');

    document.querySelector('#form-title').textContent = data.guide_question;
    const answerDate = document.querySelector('#answer-date');
    if (data.answer_date) {
      const time = answerDate.querySelector('time');
      time.dateTime = data.answer_date;
      time.textContent = new Date(`${data.answer_date}T00:00:00Z`).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
      answerDate.hidden = false;
    } else {
      answerDate.hidden = true;
    }
  } catch (error) {
    console.error('Loading public Q&A settings failed:', error);
    message.textContent = 'Could not load the current Q&A details.';
    message.classList.add('is-error');
  }
}

async function loadPublicStats() {
  if (!supabase) return;

  const message = document.querySelector('#public-stats-message');
  try {
    const stats = await fetchPublicQuestionStats();
    document.querySelector('#public-submitted-count').textContent =
      stats.submitted.toLocaleString();
    document.querySelector('#public-answered-count').textContent =
      stats.answered.toLocaleString();
    message.textContent = '';
  } catch (error) {
    console.error('Loading public question stats failed:', error);
    message.textContent = 'Community question totals are temporarily unavailable.';
  }
}

async function fetchPublicQuestionStats() {
  const { data, error } = await supabase.rpc('get_public_question_stats');
  if (!error) {
    const row = Array.isArray(data) ? data[0] : data;
    if (row && row.submitted != null && row.answered != null) {
      return {
        submitted: Number(row.submitted),
        answered: Number(row.answered),
      };
    }
  }

  // Fallback for projects that have not installed the RPC yet: count only
  // source/status columns (no question text) when anon SELECT is granted.
  const [submittedRes, answeredRes] = await Promise.all([
    supabase
      .from('questions')
      .select('source', { count: 'exact', head: true })
      .eq('source', 'anonymous'),
    supabase
      .from('questions')
      .select('source', { count: 'exact', head: true })
      .eq('source', 'anonymous')
      .eq('status', 'answered'),
  ]);

  if (submittedRes.error) throw submittedRes.error;
  if (answeredRes.error) throw answeredRes.error;

  return {
    submitted: Number(submittedRes.count ?? 0),
    answered: Number(answeredRes.count ?? 0),
  };
}

function renderAdmin() {
  document.querySelector('#app').innerHTML = `
    <main class="page-shell">
      <header class="topbar">
        <a class="brand" href="/" aria-label="Manifested Word Bride Assembly home">
          <span class="brand-logo-frame"><img class="brand-logo" src="${churchLogo}" alt="" /></span>
          <span class="brand-name">Manifested Word<br />Bride Assembly</span>
        </a>
        <a class="admin-back-link" href="/">← Public Q&amp;A</a>
      </header>

      <section class="admin-main">
        <p class="eyebrow"><span class="eyebrow-line"></span> PRIVATE ADMIN AREA</p>
        <h1 class="admin-title">Question<br /><em>inbox.</em></h1>
        <p class="admin-intro">Sign in with an approved admin account to review submissions.</p>

        <div id="admin-config-notice" class="config-notice" ${isConfigured ? 'hidden' : ''} role="status">
          Supabase isn’t connected yet. Add your project URL and anon key to
          <code>.env.local</code> to enable admin sign-in.
        </div>

        <section id="admin-login-panel" class="admin-panel" aria-labelledby="admin-login-title">
          <h2 id="admin-login-title">Admin sign in</h2>
          <form id="admin-login-form" class="admin-form">
            <label for="admin-email">Email</label>
            <input id="admin-email" name="email" type="email" autocomplete="username" required />
            <label for="admin-password">Password</label>
            <input id="admin-password" name="password" type="password" autocomplete="current-password" required />
            <button id="admin-login-button" type="submit" ${isConfigured ? '' : 'disabled'}>Sign in</button>
            <p id="admin-login-message" class="admin-message" aria-live="polite"></p>
          </form>
        </section>

        <section id="admin-denied-panel" class="admin-panel" hidden role="status">
          <h2>Admin access required</h2>
          <p>This account is not on the approved admin list. Ask your Supabase project owner to grant access.</p>
          <button id="admin-denied-signout" class="secondary-button" type="button">Sign out</button>
        </section>

        <section id="admin-dashboard" hidden aria-labelledby="admin-dashboard-title">
          <div class="admin-dashboard-heading">
            <div>
              <p class="card-kicker">SUBMISSIONS</p>
              <h2 id="admin-dashboard-title">Questions</h2>
            </div>
            <button id="admin-signout" class="secondary-button" type="button">Sign out</button>
          </div>
          <section class="stats-grid admin-stats" aria-label="Question totals">
            <article class="stat-card">
              <span class="stat-label">Submissions</span>
              <strong id="admin-submitted-count" class="stat-value">—</strong>
              <span class="stat-help">Anonymous questions received</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Awaiting review</span>
              <strong id="admin-pending-count" class="stat-value">—</strong>
              <span class="stat-help">Submissions marked pending</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Reviewed</span>
              <strong id="admin-reviewed-count" class="stat-value">—</strong>
              <span class="stat-help">Submissions reviewed</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Answered</span>
              <strong id="admin-answered-count" class="stat-value">—</strong>
              <span class="stat-help">Submissions marked answered</span>
            </article>
            <article class="stat-card">
              <span class="stat-label">Guide questions</span>
              <strong id="admin-guide-count" class="stat-value">—</strong>
              <span class="stat-help">Added by an admin</span>
            </article>
          </section>
          <section class="guide-question-panel" aria-labelledby="guide-question-title">
            <p class="card-kicker">PUBLIC PAGE</p>
            <h2 id="qna-settings-title">Public Q&amp;A details</h2>
            <p class="guide-question-help">Choose the question heading and the date your church will answer questions. These details appear on the public page.</p>
            <form id="qna-settings-form" class="admin-form">
              <label for="qna-guide-question">Public question heading</label>
              <input id="qna-guide-question" name="guide_question" type="text" minlength="8" maxlength="120" required />
              <label for="qna-answer-date">Answer date</label>
              <input id="qna-answer-date" name="answer_date" type="date" />
              <button id="qna-settings-button" type="submit">Save public details</button>
              <p id="qna-settings-message" class="admin-message" aria-live="polite"></p>
            </form>
          </section>
          <p id="admin-dashboard-message" class="admin-message" aria-live="polite"></p>
          <div id="question-list" class="question-list" aria-live="polite"></div>
        </section>
      </section>

      <footer class="footer">
        <span>PRIVATE TO APPROVED ADMIN ACCOUNTS</span>
        <span class="footer-right"><a href="/">BACK TO Q&amp;A</a></span>
      </footer>
    </main>
  `;

  const loginPanel = document.querySelector('#admin-login-panel');
  const deniedPanel = document.querySelector('#admin-denied-panel');
  const dashboard = document.querySelector('#admin-dashboard');
  const loginForm = document.querySelector('#admin-login-form');
  const loginMessage = document.querySelector('#admin-login-message');
  const dashboardMessage = document.querySelector('#admin-dashboard-message');
  const questionList = document.querySelector('#question-list');
  const qnaSettingsForm = document.querySelector('#qna-settings-form');
  const qnaSettingsMessage = document.querySelector('#qna-settings-message');

  qnaSettingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    qnaSettingsMessage.textContent = '';
    qnaSettingsMessage.classList.remove('is-error');
    const formData = new FormData(qnaSettingsForm);
    const guideQuestion = formData.get('guide_question').trim();
    const answerDate = formData.get('answer_date');
    const button = document.querySelector('#qna-settings-button');

    if (guideQuestion.length < 8) {
      qnaSettingsMessage.textContent = 'Please enter a public question heading with at least 8 characters.';
      qnaSettingsMessage.classList.add('is-error');
      return;
    }

    button.disabled = true;
    button.textContent = 'Saving…';
    try {
      const { data, error } = await supabase
        .from('qna_settings')
        .update({
          guide_question: guideQuestion,
          answer_date: answerDate || null,
        })
        .eq('id', true)
        .select('guide_question')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('No Q&A settings row was updated.');
      qnaSettingsMessage.textContent = 'Public Q&A details saved.';
    } catch (error) {
      console.error('Saving public Q&A settings failed:', error);
      qnaSettingsMessage.textContent = 'Could not save the public Q&A details. Please try again.';
      qnaSettingsMessage.classList.add('is-error');
    } finally {
      button.disabled = false;
      button.textContent = 'Save public details';
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';
    const formData = new FormData(loginForm);
    const button = document.querySelector('#admin-login-button');
    button.disabled = true;
    button.textContent = 'Signing in…';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      if (error) throw error;
      await showAdmin(data.user);
    } catch (error) {
      console.error('Admin sign-in failed:', error);
      loginMessage.textContent = 'Sign-in failed. Check your details and try again.';
      loginMessage.classList.add('is-error');
    } finally {
      button.disabled = false;
      button.textContent = 'Sign in';
    }
  });

  document.querySelector('#admin-signout').addEventListener('click', signOut);
  document.querySelector('#admin-denied-signout').addEventListener('click', signOut);

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dashboard.hidden = true;
      deniedPanel.hidden = true;
      loginPanel.hidden = false;
      loginForm.reset();
    } catch (error) {
      console.error('Admin sign-out failed:', error);
      dashboardMessage.textContent = 'Could not sign out. Please try again.';
      dashboardMessage.classList.add('is-error');
    }
  }

  async function showAdmin(user) {
    loginPanel.hidden = true;
    deniedPanel.hidden = true;
    dashboard.hidden = true;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;

      if (!data) {
        deniedPanel.hidden = false;
        return;
      }

      dashboard.hidden = false;
      await Promise.all([loadQuestions(), loadQnaSettings()]);
    } catch (error) {
      console.error('Admin authorization check failed:', error);
      loginPanel.hidden = false;
      loginMessage.textContent = 'Could not verify admin access. Check the Supabase setup.';
      loginMessage.classList.add('is-error');
    }
  }

  async function loadQnaSettings() {
    qnaSettingsMessage.textContent = 'Loading public Q&A details…';
    qnaSettingsMessage.classList.remove('is-error');
    try {
      const { data, error } = await supabase
        .from('qna_settings')
        .select('id, guide_question, answer_date')
        .eq('id', true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Public Q&A settings are not configured.');
      qnaSettingsForm.elements.guide_question.value = data.guide_question;
      qnaSettingsForm.elements.answer_date.value = data.answer_date || '';
      qnaSettingsMessage.textContent = '';
    } catch (error) {
      console.error('Loading admin Q&A settings failed:', error);
      qnaSettingsMessage.textContent = 'Could not load public Q&A details. Check your Supabase setup.';
      qnaSettingsMessage.classList.add('is-error');
    }
  }

  async function loadQuestions() {
    dashboardMessage.textContent = 'Loading questions…';
    dashboardMessage.classList.remove('is-error');
    questionList.replaceChildren();

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question, topic, source, status, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;

      const submissions = data.filter((question) => question.source === 'anonymous');
      document.querySelector('#admin-submitted-count').textContent =
        submissions.length.toLocaleString();
      document.querySelector('#admin-pending-count').textContent =
        submissions.filter((question) => question.status === 'pending').length.toLocaleString();
      document.querySelector('#admin-reviewed-count').textContent =
        submissions.filter((question) => question.status === 'reviewed').length.toLocaleString();
      document.querySelector('#admin-answered-count').textContent =
        submissions.filter((question) => question.status === 'answered').length.toLocaleString();
      document.querySelector('#admin-guide-count').textContent =
        data.filter((question) => question.source === 'guide').length.toLocaleString();

      dashboardMessage.textContent = data.length
        ? `${data.length} question${data.length === 1 ? '' : 's'}`
        : 'No questions yet.';
      data.forEach((question, index) => {
        questionList.append(createQuestionCard(question, data, index));
      });
    } catch (error) {
      console.error('Loading questions failed:', error);
      dashboardMessage.textContent = 'Could not load questions. Check your admin access and Supabase policies.';
      dashboardMessage.classList.add('is-error');
    }
  }

  function createQuestionCard(question, questions, index) {
    const card = document.createElement('article');
    card.className = 'admin-question-card';

    const metadata = document.createElement('div');
    metadata.className = 'admin-question-meta';
    const labels = document.createElement('div');
    labels.className = 'admin-question-labels';
    const topic = document.createElement('span');
    topic.className = 'question-topic';
    topic.textContent = question.topic;
    const source = document.createElement('span');
    source.className = `source-badge ${question.source === 'guide' ? 'source-guide' : 'source-anonymous'}`;
    source.textContent = question.source === 'guide' ? 'Guide question' : 'Anonymous submission';
    const date = document.createElement('time');
    date.dateTime = question.created_at;
    date.textContent = new Date(question.created_at).toLocaleString();
    labels.append(topic, source);
    metadata.append(labels, date);

    const text = document.createElement('p');
    text.className = 'admin-question-text';
    text.textContent = question.question;

    const actions = document.createElement('div');
    actions.className = 'admin-question-actions';
    const presentButton = document.createElement('button');
    presentButton.className = 'secondary-button present-button';
    presentButton.type = 'button';
    presentButton.textContent = 'Present';
    presentButton.setAttribute('aria-label', `Present question: ${question.question}`);
    presentButton.addEventListener('click', () => presentQuestion(questions, index, presentButton));
    const status = document.createElement('span');
    status.className = `status-badge status-${question.status}`;
    status.textContent = question.status;
    const statusLabel = document.createElement('label');
    statusLabel.className = 'status-control-label';
    statusLabel.textContent = 'Update status';
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-select';
    statusSelect.setAttribute('aria-label', `Update status for question ${question.id}`);
    for (const value of ['pending', 'reviewed', 'answered', 'archived']) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value[0].toUpperCase() + value.slice(1);
      option.selected = value === question.status;
      statusSelect.append(option);
    }
    statusSelect.addEventListener('change', async () => {
      statusSelect.disabled = true;
      dashboardMessage.textContent = 'Updating question…';
      try {
        const { data, error } = await supabase
          .from('questions')
          .update({ status: statusSelect.value })
          .eq('id', question.id)
          .select('id')
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('No question was updated.');
        await loadQuestions();
      } catch (error) {
        console.error('Updating question status failed:', error);
        dashboardMessage.textContent = 'Could not update the question. Please try again.';
        dashboardMessage.classList.add('is-error');
        statusSelect.disabled = false;
      }
    });
    actions.append(presentButton, status, statusLabel, statusSelect);
    card.append(metadata, text, actions);
    return card;
  }

  function presentQuestion(questions, startIndex, trigger) {
    let currentIndex = startIndex;
    const presentation = document.createElement('section');
    presentation.className = 'question-presentation';
    presentation.setAttribute('role', 'dialog');
    presentation.setAttribute('aria-modal', 'true');
    presentation.setAttribute('aria-label', 'Question presentation');
    presentation.tabIndex = -1;

    const header = document.createElement('header');
    header.className = 'presentation-header';
    const brand = document.createElement('div');
    brand.className = 'presentation-brand';
    const logo = document.createElement('img');
    logo.className = 'presentation-logo';
    logo.src = churchLogo;
    logo.alt = 'Manifested Word Bride Assembly';
    const churchName = document.createElement('span');
    churchName.textContent = 'Manifested Word Bride Assembly';
    brand.append(logo, churchName);

    const closeButton = document.createElement('button');
    closeButton.className = 'presentation-close';
    closeButton.type = 'button';
    closeButton.textContent = 'Exit presentation';
    closeButton.addEventListener('click', () => closePresentation());
    header.append(brand, closeButton);

    const content = document.createElement('div');
    content.className = 'presentation-content';
    const topic = document.createElement('p');
    topic.className = 'presentation-topic';
    const text = document.createElement('h1');
    text.className = 'presentation-question';
    content.append(topic, text);

    const controls = document.createElement('div');
    controls.className = 'presentation-controls';
    const counter = document.createElement('p');
    counter.className = 'presentation-count';
    counter.setAttribute('aria-live', 'polite');
    const navigation = document.createElement('div');
    navigation.className = 'presentation-navigation';
    const previousButton = document.createElement('button');
    previousButton.className = 'presentation-previous';
    previousButton.type = 'button';
    previousButton.textContent = 'Previous question';
    previousButton.addEventListener('click', showPreviousQuestion);
    const nextButton = document.createElement('button');
    nextButton.className = 'presentation-next';
    nextButton.type = 'button';
    nextButton.textContent = 'Next question';
    nextButton.addEventListener('click', showNextQuestion);
    navigation.append(previousButton, nextButton);
    controls.append(counter, navigation);

    const fullscreenNote = document.createElement('p');
    fullscreenNote.className = 'presentation-note';
    fullscreenNote.setAttribute('role', 'status');
    presentation.append(header, content, controls, fullscreenNote);
    document.body.append(presentation);

    function updatePresentationQuestion() {
      const question = questions[currentIndex];
      topic.textContent = question.topic;
      text.textContent = question.question;
      counter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
      previousButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === questions.length - 1;
      fitPresentationQuestion();
    }

    function fitPresentationQuestion() {
      if (!presentation.isConnected) return;

      text.style.fontSize = '';
      const maxFontSize = Number.parseFloat(getComputedStyle(text).fontSize);
      const contentStyles = getComputedStyle(content);
      const topicStyles = getComputedStyle(topic);
      const availableHeight = Math.max(
        0,
        content.clientHeight
          - topic.offsetHeight
          - Number.parseFloat(topicStyles.marginBottom)
          - Number.parseFloat(contentStyles.paddingTop)
          - Number.parseFloat(contentStyles.paddingBottom),
      );
      const fits = (fontSize) => {
        text.style.fontSize = `${fontSize}px`;
        return text.scrollHeight <= availableHeight && text.scrollWidth <= text.clientWidth;
      };

      let low = 8;
      let high = maxFontSize;
      let bestFit = low;
      for (let attempt = 0; attempt < 12 && high - low > 0.5; attempt += 1) {
        const fontSize = (low + high) / 2;
        if (fits(fontSize)) {
          bestFit = fontSize;
          low = fontSize;
        } else {
          high = fontSize;
        }
      }
      text.style.fontSize = `${bestFit}px`;
    }

    function showNextQuestion() {
      if (currentIndex >= questions.length - 1) return;
      currentIndex += 1;
      updatePresentationQuestion();
    }

    function showPreviousQuestion() {
      if (currentIndex === 0) return;
      currentIndex -= 1;
      updatePresentationQuestion();
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let enteredFullscreen = false;
    let closing = false;

    async function closePresentation(exitFullscreen = true) {
      if (closing) return;
      closing = true;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('resize', fitPresentationQuestion);
      if (exitFullscreen && document.fullscreenElement === presentation) {
        try {
          await document.exitFullscreen();
        } catch (error) {
          console.error('Exiting question presentation failed:', error);
        }
      }
      presentation.remove();
      document.body.style.overflow = previousBodyOverflow;
      trigger.focus();
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePresentation();
      } else if (event.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        event.preventDefault();
        showNextQuestion();
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        showPreviousQuestion();
      }
    }

    function onFullscreenChange() {
      if (enteredFullscreen && document.fullscreenElement !== presentation) {
        closePresentation(false);
      } else {
        fitPresentationQuestion();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('resize', fitPresentationQuestion);
    updatePresentationQuestion();
    document.fonts.ready.then(fitPresentationQuestion);
    closeButton.focus();

    if (typeof presentation.requestFullscreen === 'function') {
      presentation.requestFullscreen().then(() => {
        enteredFullscreen = document.fullscreenElement === presentation;
      }).catch((error) => {
        console.error('Entering question presentation fullscreen failed:', error);
        fullscreenNote.textContent = 'Browser fullscreen is unavailable. The question remains in presentation view.';
      });
    } else {
      fullscreenNote.textContent = 'Browser fullscreen is unavailable. The question remains in presentation view.';
    }
  }

  async function restoreSession() {
    if (!isConfigured) return;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data.session) await showAdmin(data.session.user);
    } catch (error) {
      console.error('Restoring admin session failed:', error);
      loginMessage.textContent = 'Could not restore your sign-in. Please refresh and try again.';
      loginMessage.classList.add('is-error');
    }
  }

  restoreSession();
}
