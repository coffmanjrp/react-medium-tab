import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Image,
  Loader,
  Dimmer,
  Button,
  Select,
  Message,
} from 'semantic-ui-react';

export default function Medium() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState([
    { key: 1, text: 'Technology', value: 'technology' },
    { key: 2, text: 'Science', value: 'science' },
    { key: 3, text: 'Blockchain', value: 'blockchain' },
  ]);
  const [noInternetError, setNoInternetError] = useState(false);

  useEffect(() => {
    getMediumArticle();
  }, []);

  const getMediumArticle = (topic?) => {
    let url = 'https://medrum.herokuapp.com/articles';

    if (topic) {
      url += `?topic=${topic}`;
    }

    axios
      .get(url)
      .then((res) => {
        setLoading(false);
        setArticles(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setNoInternetError(true);
      });
  };

  const selectCategory = (e) => {
    getMediumArticle(e.target.innerText);
  };

  if (loading) {
    return (
      <Dimmer active>
        <Loader size="huge">Loading</Loader>
      </Dimmer>
    );
  }

  if (noInternetError) {
    return (
      <Dimmer active>
        <Message
          icon="info circle"
          header="Internet Connection Error"
          content="There seems to be issue with your internet"
          negative
        />
        <Button color="blue" onClick={getMediumArticle}>
          Try Again
        </Button>
      </Dimmer>
    );
  }

  return (
    <Container>
      <Select
        placeholder="Choose a category"
        options={categories}
        onChange={selectCategory}
      />
      <Card.Group doubling itemsPerRow={4} stackable>
        {articles &&
          articles.map((article, k) => {
            return (
              <Fragment key={k}>
                <Card>
                  <Image src={article.image_url} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{article.title}</Card.Header>
                    {/* <Card.Meta>
                      <p>
                        {article.author.name}{' '}
                        {article.publication
                          ? `in ${article.publication.name}`
                          : `in ${article.author.name}`}
                      </p>
                    </Card.Meta> */}
                    <Card.Description>{article.summary}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <span className="date" style={{ marginRight: '10px' }}>
                      {article.date} - {article.reading}
                    </span>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button color="blue">Read more</Button>
                    </a>
                  </Card.Content>
                </Card>
              </Fragment>
            );
          })}
      </Card.Group>
    </Container>
  );
}
